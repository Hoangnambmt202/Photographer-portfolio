import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.orm import Session
from slugify import slugify
import cloudinary.uploader
from datetime import datetime
from typing import Optional, List
from app.config.database import get_db
from app.schemas.photo import PhotoResponse
from app.models.photo import Photo

from pydantic import BaseModel

router = APIRouter(prefix="/api/photos", tags=["Photos"])

# 🟩 1. POST /photos (Tạo mới)
@router.post("/", response_model=PhotoResponse)
async def create_photo(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    taken_at: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    album_id: Optional[int] = Form(None),
    image_file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_url = None
    # Nếu có file upload
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

    new_photo = Photo(
        title=title,
        slug=slugify(title),
        description=description,
        image_url=image_url,
        taken_at=datetime.fromisoformat(taken_at) if taken_at else None,
        location=location,
        album_id=album_id,
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo


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
