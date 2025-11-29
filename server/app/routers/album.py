from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from slugify import slugify
from app.config.database import get_db
from app.config.cloudinary_config import cloudinary  
from app.config.security import get_current_admin
from app.models.album import Album
from app.schemas.album import AlbumResponse
from app.schemas.response import BaseResponse
import cloudinary.uploader

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
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    slug = slugify(title)

    # Check slug exists
    if db.query(Album).filter(Album.slug == slug).first():
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")

    # Upload ảnh lên Cloudinary
    cover_url = None
    if cover_image:
        upload = cloudinary.uploader.upload(
            cover_image.file,
            folder="albums/covers",
            resource_type="image"
        )
        cover_url = upload.get("secure_url")

    album = Album(
        title=title,
        description=description,
        slug=slug,
        cover_image=cover_url,
        status=status,
    )

    db.add(album)
    db.commit()
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
    albums = db.query(Album).order_by(Album.created_at.desc()).all()
    return BaseResponse(
        status="success",
        message="Danh sách album",
        data=[AlbumResponse.model_validate(a) for a in albums]
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
