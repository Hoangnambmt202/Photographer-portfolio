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
from app.schemas.album import AlbumResponse, AlbumUpdateRequest
from app.schemas.photo import PhotoResponse
from app.schemas.response import BaseResponse
import cloudinary.uploader
import json
from typing import Optional
from pydantic import BaseModel
from typing import List
import math

router = APIRouter(prefix="/api/albums", tags=["Albums"])


# ------------------------------------------------------
# CREATE ALBUM
# ------------------------------------------------------
class AlbumCreateRequest(BaseModel):
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "draft"
    category: Optional[int] = None
    tags: Optional[List[dict]] = []  # [{id: 1, value: "tag1"}, ...]


@router.post("", response_model=BaseResponse)
async def create_album(
    request: AlbumCreateRequest,  # ← Nhận JSON qua Pydantic model
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    # Nếu không có slug, tạo từ title
    slug = request.slug if request.slug else slugify(request.title)

    # Kiểm tra slug tồn tại
    if db.query(Album).filter(Album.slug == slug).first():
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")

    # Tạo album (không có cover_image trong JSON)
    album = Album(
        title=request.title,
        description=request.description,
        slug=slug,
        cover_image=None,  # Có thể upload riêng sau
        status=request.status,
        category_id=request.category,
    )
    db.add(album)
    db.commit()
    db.refresh(album)

    # Xử lý Tags
    if request.tags:
        try:
            final_tag_objs = []
            for tag_item in request.tags:
                # ---- Tag cũ: có id ----
                if "id" in tag_item and tag_item["id"]:
                    tag = db.query(Tag).filter(Tag.id == tag_item["id"]).first()
                    if tag:
                        final_tag_objs.append(tag)
                        continue

                # ---- Tag mới: chỉ có name hoặc value ----
                # Lấy name từ 'name' hoặc 'value'
                tag_name = tag_item.get("name") or tag_item.get("value")
                if not tag_name:
                    continue

                tag_name = tag_name.strip()
                if not tag_name:
                    continue

                # Kiểm tra tag name tồn tại chưa
                existing = db.query(Tag).filter(Tag.name == tag_name).first()

                if existing:
                    final_tag_objs.append(existing)
                else:
                    # Tạo tag mới
                    new_tag = Tag(name=tag_name, slug=slugify(tag_name))
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
        data=AlbumResponse.model_validate(album),
    )


# ------------------------------------------------------
# GET ALL ALBUMS
# ------------------------------------------------------
@router.get("", response_model=BaseResponse)
def get_albums(
    search: str | None = None,
    status: str | None = None,
    category_id: int | None = None,
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db),
):
    query = (
        db.query(Album, func.count(Photo.id).label("photo_quantity"))
        .outerjoin(Photo, Photo.album_id == Album.id)
        .group_by(Album.id)
    )

    if search:
        query = query.filter(Album.title.ilike(f"%{search}%"))

    if status:
        query = query.filter(Album.status == status)

    if category_id:
        query = query.filter(Album.category_id == category_id)

    total = query.count()

    albums = (
        query.order_by(Album.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    data = []
    for album, photo_quantity in albums:
        item = AlbumResponse.model_validate(album).model_dump()
        item["photo_quantity"] = photo_quantity
        data.append(item)

    return BaseResponse(
        status="success",
        message="Danh sách album",
        data={
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total / limit),
            "data": data,
        },
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
        data=AlbumResponse.model_validate(album),
    )


# ------------------------------------------------------
# UPDATE
# ------------------------------------------------------
@router.put("/{album_id}", response_model=BaseResponse)
async def update_album(
    album_id: int,
    request: AlbumUpdateRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    # ---- Update fields ----
    if request.title is not None:
        album.title = request.title
        album.slug = slugify(request.title)

    if request.description is not None:
        album.description = request.description

    if request.status is not None:
        album.status = request.status

    if request.category is not None:
        album.category_id = request.category

    if request.cover_image is not None:
        album.cover_image = request.cover_image

    # ---- Update tags (THEO ID) ----
    if request.tags is not None:
        tags = db.query(Tag).filter(Tag.id.in_(request.tags)).all()

        # (Optional) validate thiếu tag
        if len(tags) != len(request.tags):
            raise HTTPException(
                status_code=400,
                detail="Một hoặc nhiều tag không tồn tại",
            )

        album.tags = tags  # 👈 gán trực tiếp

    db.commit()
    db.refresh(album)

    return BaseResponse(
        status="success",
        message="Cập nhật album thành công",
        data=AlbumResponse.model_validate(album),
    )


# ------------------------------------------------------
# DELETE
# ------------------------------------------------------
@router.delete("/{album_id}", response_model=BaseResponse)
def delete_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    db.delete(album)
    db.commit()

    return BaseResponse(status="success", message="Xóa album thành công")


# 🟨 5. GET /albums/{album_id}/photos - Lấy tất cả ảnh trong album
@router.get("/{album_id}/photos", response_model=BaseResponse)
def get_album_photos(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    photos = (
        db.query(Photo).filter(Photo.album_id == album_id).order_by(Photo.order).all()
    )

    return BaseResponse(
        status="success",
        message="Danh sách ảnh trong album",
        data=[PhotoResponse.model_validate(p) for p in photos],
    )


# 🟨 6. PATCH /albums/{album_id}/reorder-photos - Reorder photos bằng drag-drop
class ReorderPhotosRequest(BaseModel):
    photos: List[dict]  # [{id: int, order: int}, ...]


@router.patch("/{album_id}/reorder-photos", response_model=BaseResponse)
async def reorder_album_photos(
    album_id: int,
    request: ReorderPhotosRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    # Cập nhật order cho mỗi photo
    for item in request.photos:
        photo = db.query(Photo).filter(Photo.id == item["id"]).first()
        if photo and photo.album_id == album_id:
            photo.order = item["order"]
    db.commit()
    # Trả về danh sách ảnh đã reorder
    photos = (
        db.query(Photo).filter(Photo.album_id == album_id).order_by(Photo.order).all()
    )
    return BaseResponse(
        status="success",
        message="Reorder ảnh thành công",
        data=[PhotoResponse.model_validate(p) for p in photos],
    )


# 🟨 7. PATCH /photos/{photo_id}/set-featured - Set ảnh featured của album
class SetFeaturedRequest(BaseModel):
    album_id: int


@router.patch("/{photo_id}/set-featured", response_model=BaseResponse)
async def set_featured_photo(
    photo_id: int,
    request: SetFeaturedRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
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
        data=PhotoResponse.model_validate(photo),
    )
