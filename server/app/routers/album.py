from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from slugify import slugify
from app.config.database import get_db
from app.config.cloudinary_config import cloudinary  
from app.config.security import get_current_admin
from app.models.album import Album
from app.models.photo import Photo
from app.models.tag import Tag
from app.schemas.album import AlbumResponse
from app.schemas.photo import PhotoResponse
from app.schemas.response import BaseResponse
import cloudinary.uploader
import json
from typing import Optional
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/albums", tags=["Albums"])

# ------------------------------------------------------
# CREATE ALBUM
# ------------------------------------------------------
@router.post("/", response_model=BaseResponse)
async def create_album(
    title: str = Form(...),
    description: str = Form(None),
    status: str = Form("draft"),
    cover_image: UploadFile = File(None),
    category: str = Form(None),  # JSON array as string
    tags: Optional[str] = Form(None),   # JSON string
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    slug = slugify(title)

    # Kiểm tra slug tồn tại
    if db.query(Album).filter(Album.slug == slug).first():
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")

    # Upload cover
    cover_url = None
    if cover_image:
        upload = cloudinary.uploader.upload(
            cover_image.file,
            folder="photographer_albums",
            resource_type="image"
        )
        cover_url = upload.get("secure_url")

    # Tạo album
    album = Album(
        title=title,
        description=description,
        slug=slug,
        cover_image=cover_url,
        status=status,
        category_id=category
    )

    db.add(album)
    db.commit()
    db.refresh(album)

    # Xử lý Tags
    if tags:
        try:
            tags_list = json.loads(tags)

            final_tag_objs = []

            for tag_item in tags_list:

                # ---- Tag cũ: có id ----
                if "id" in tag_item and tag_item["id"]:
                    tag = db.query(Tag).filter(Tag.id == tag_item["id"]).first()
                    if tag:
                        final_tag_objs.append(tag)
                        continue

                # ---- Tag mới: chỉ có name ----
                tag_name = tag_item.get("name", "").strip()
                if not tag_name:
                    continue

                # Kiểm tra tag name tồn tại chưa
                existing = db.query(Tag).filter(Tag.name == tag_name).first()

                if existing:
                    final_tag_objs.append(existing)
                else:
                    # Tạo tag mới
                    new_tag = Tag(
                        name=tag_name,
                        slug=slugify(tag_name)
                    )
                    db.add(new_tag)
                    db.commit()
                    db.refresh(new_tag)
                    final_tag_objs.append(new_tag)

            # Gán vào bảng trung gian
            album.tags = final_tag_objs
            db.commit()

        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Tag format error: {str(e)}")

    db.refresh(album)
    return BaseResponse(
        status="success",
        message="Tạo album thành công",
        data=AlbumResponse.model_validate(album)
    )


# ------------------------------------------------------
# GET ALL ALBUMS
# ------------------------------------------------------
@router.get("/", response_model=BaseResponse)
def get_albums(db: Session = Depends(get_db)):
    albums = (
        db.query(
            Album,
            func.count(Photo.id).label("photo_quantity")
        )
        .outerjoin(Photo, Photo.album_id == Album.id)
        .group_by(Album.id)
        .order_by(Album.created_at.desc())
        .all()
    )

    # Chuẩn hóa output
    data = []
    for album, photo_quantity in albums:
        album_data = AlbumResponse.model_validate(album).model_dump()
        album_data["photo_quantity"] = photo_quantity
        data.append(album_data)

    return BaseResponse(
        status="success",
        message="Danh sách album",
        data=data
    )


# ------------------------------------------------------
# GET ONE
# ------------------------------------------------------
@router.get("/{album_id}", response_model=BaseResponse)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    return BaseResponse(
        status="success",
        message="Chi tiết album",
        data=AlbumResponse.model_validate(album)
    )


# ------------------------------------------------------
# UPDATE
# ------------------------------------------------------
@router.put("/{album_id}", response_model=BaseResponse)
async def update_album(
    album_id: int,
    title: str = Form(None),
    description: str = Form(None),
    status: str = Form(None),
    cover_image: UploadFile = File(None),
    tags: Optional[str] = Form(None),
    category: str = Form(None), 
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    if cover_image:
        upload = cloudinary.uploader.upload(
            cover_image.file,
            folder="albums/covers",
            resource_type="image"
        )
        album.cover_image = upload.get("secure_url")

    if title:
        album.title = title
        album.slug = slugify(title)
    if description is not None:
        album.description = description
    if status:
        album.status = status
    if category is not None:
        album.category_id = category

    # Update tags
    if tags:
        try:
            tag_id_list = json.loads(tags)
            if isinstance(tag_id_list, list):
                tags = db.query(Tag).filter(Tag.id.in_(tag_id_list)).all()
                album.tags = tags
        except (json.JSONDecodeError, ValueError):
            pass

    db.commit()
    db.refresh(album)

    return BaseResponse(
        status="success",
        message="Cập nhật album thành công",
        data=AlbumResponse.model_validate(album)
    )


# ------------------------------------------------------
# DELETE
# ------------------------------------------------------
@router.delete("/{album_id}", response_model=BaseResponse)
def delete_album(album_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    db.delete(album)
    db.commit()

    return BaseResponse(
        status="success",
        message="Xóa album thành công"
    )
# 🟨 5. GET /albums/{album_id}/photos - Lấy tất cả ảnh trong album
@router.get("/{album_id}/photos", response_model=BaseResponse)
def get_album_photos(
    album_id: int,
    db: Session = Depends(get_db)
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")
    
    photos = db.query(Photo).filter(
        Photo.album_id == album_id
    ).order_by(Photo.order).all()
    
    return BaseResponse(
        status="success",
        message="Danh sách ảnh trong album",
        data=[PhotoResponse.model_validate(p) for p in photos]
    )


# 🟨 6. PATCH /albums/{album_id}/reorder-photos - Reorder photos bằng drag-drop
class ReorderPhotosRequest(BaseModel):
    photos: List[dict]  # [{id: int, order: int}, ...]

@router.patch("/{album_id}/reorder-photos", response_model=BaseResponse)
async def reorder_album_photos(
    album_id: int,
    request: ReorderPhotosRequest,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")
    
    # Cập nhật order cho mỗi photo
    for item in request.photos:
        photo = db.query(Photo).filter(Photo.id == item['id']).first()
        if photo and photo.album_id == album_id:
            photo.order = item['order']
    
    db.commit()
    
    # Trả về danh sách ảnh đã reorder
    photos = db.query(Photo).filter(
        Photo.album_id == album_id
    ).order_by(Photo.order).all()
    
    return BaseResponse(
        status="success",
        message="Reorder ảnh thành công",
        data=[PhotoResponse.model_validate(p) for p in photos]
    )


# 🟨 7. PATCH /photos/{photo_id}/set-featured - Set ảnh featured của album
class SetFeaturedRequest(BaseModel):
    album_id: int

@router.patch("/{photo_id}/set-featured", response_model=BaseResponse)
async def set_featured_photo(
    photo_id: int,
    request: SetFeaturedRequest,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo không tồn tại")
    
    album = db.query(Album).filter(Album.id == request.album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")
    
    # Photo phải thuộc album này
    if photo.album_id != request.album_id:
        raise HTTPException(status_code=400, detail="Photo không thuộc album này")
    
    # Set featured_photo_id cho album
    album.featured_photo_id = photo_id
    db.commit()
    
    return BaseResponse(
        status="success",
        message="Đặt ảnh featured thành công",
        data=PhotoResponse.model_validate(photo)
    )
