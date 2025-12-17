import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.orm import Session
from slugify import slugify
import cloudinary.uploader
from datetime import datetime
from typing import Optional, List
from pathlib import Path
from app.config.security import get_current_admin
from app.config.database import get_db
from app.schemas.photo import PhotoResponse
from app.schemas.response import BaseResponse
from app.models.photo import Photo
from pydantic import BaseModel

router = APIRouter(prefix="/api/photos", tags=["Photos"])


def _unique_slug(db: Session, base_slug: str) -> str:
    """
    Tạo slug unique để tránh lỗi unique constraint khi upload nhiều ảnh
    hoặc upload ảnh trùng tên.
    """
    slug = base_slug or "photo"
    i = 1
    while db.query(Photo).filter(Photo.slug == slug).first():
        slug = f"{base_slug}-{i}"
        i += 1
    return slug

# 🟩 1. POST /photos (Tạo mới)
@router.post("/", response_model=BaseResponse)
async def create_photo(
    title: str = Form(...),
    description: str = Form(None),
    taken_at: str = Form(None),
    location: Optional[str] = Form(None),
    album_id: Optional[int] = Form(None),
    image_url: UploadFile = File(...),
    status: str = Form("draft"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    slug = _unique_slug(db, slugify(title))
    # Upload ảnh lên Cloudinary
    uploaded_url = None
    if image_url:
        upload = cloudinary.uploader.upload(
            image_url.file,
            folder="photographer_photos",
            resource_type="image"
        )
        uploaded_url = upload.get("secure_url")

    photo = Photo(
        title=title,
        slug=slug,
        description=description,
        image_url=uploaded_url,  
        status=status,
        taken_at=datetime.fromisoformat(taken_at) if taken_at else None,
        location=location,
        album_id=album_id,
    )


    db.add(photo)
    db.commit()
    db.refresh(photo)
    return BaseResponse(
        status="success",
        message="Tạo ảnh thành công",
        data=PhotoResponse.model_validate(photo)
        )


# 🟩 1b. POST /photos/bulk (Tạo nhiều ảnh cùng lúc)
@router.post("/bulk", response_model=BaseResponse)
async def create_photos_bulk(
    images: List[UploadFile] = File(...),
    description: str = Form(None),
    taken_at: str = Form(None),
    location: Optional[str] = Form(None),
    album_id: Optional[int] = Form(None),
    status: str = Form("draft"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    if not images:
        raise HTTPException(status_code=400, detail="Không có ảnh để upload")
    if len(images) > 20:
        raise HTTPException(status_code=400, detail="Chỉ cho phép upload tối đa 20 ảnh/lần")

    taken_at_dt = datetime.fromisoformat(taken_at) if taken_at else None

    created: list[PhotoResponse] = []
    for image in images:
        # lấy title từ filename (bỏ extension)
        filename = image.filename or "photo"
        title = Path(filename).stem.strip() or "photo"

        slug = _unique_slug(db, slugify(title))

        upload = cloudinary.uploader.upload(
            image.file,
            folder="photographer_photos",
            resource_type="image"
        )
        uploaded_url = upload.get("secure_url")

        photo = Photo(
            title=title,
            slug=slug,
            description=description,
            image_url=uploaded_url,
            status=status,
            taken_at=taken_at_dt,
            location=location,
            album_id=album_id,
        )
        db.add(photo)
        db.flush()  # lấy id trước commit nếu cần
        created.append(PhotoResponse.model_validate(photo))

    db.commit()

    return BaseResponse(
        status="success",
        message=f"Tải lên thành công {len(created)} ảnh",
        data=created
    )


# 🟩 2. GET /photos

class PaginatedPhotos(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: list[PhotoResponse]

@router.get("/", response_model=PaginatedPhotos)
def list_photos(
    page: int = Query(1, ge=1, description="Số trang hiện tại"),
    limit: int = Query(10, ge=1, le=100, description="Số bản ghi mỗi trang"),
    db: Session = Depends(get_db)
):
    total = db.query(Photo).count()
    offset = (page - 1) * limit
    photos = db.query(Photo).order_by(Photo.id.desc()).offset(offset).limit(limit).all()
    total_pages = (total + limit - 1) // limit  # ceil(total/limit)
    return PaginatedPhotos(
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
        data=photos
    )

# 🟩 3. PUT /photos/{id}
@router.put("/{id}", response_model=PhotoResponse)
async def update_photo(
    id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    taken_at: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    album_id: Optional[int] = Form(None),
    image_file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    photo = db.query(Photo).filter(Photo.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo không tồn tại")

    if image_file:
        try:
            upload_result = cloudinary.uploader.upload(
                image_file.file,
                folder="portfolio/photos",
                public_id=slugify(title),
                resource_type="image"
            )
            image_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi upload Cloudinary: {e}")


    if title: photo.title = title
    if description: photo.description = description
    if location: photo.location = location
    if taken_at: photo.taken_at = datetime.fromisoformat(taken_at)
    if album_id is not None: photo.album_id = album_id
    if image_url: photo.image_url = image_url
    photo.slug = slugify(photo.title)

    db.commit()
    db.refresh(photo)
    return photo


# 🟩 4. DELETE /photos/{id}
@router.delete("/{id}")
def delete_photo(id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo không tồn tại")
    db.delete(photo)
    db.commit()
    return {"message": "Đã xóa ảnh thành công"}


