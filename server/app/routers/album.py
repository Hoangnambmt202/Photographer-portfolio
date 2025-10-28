from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slugify import slugify
from app.config.database import get_db
from app.config.security import get_current_admin
from app.models.album import Album
from app.schemas.album import AlbumCreate, AlbumResponse
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/api/albums", tags=["Albums"])

@router.post("/", response_model=BaseResponse)
def create_album(data: AlbumCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    slug = slugify(data.title)
    if db.query(Album).filter(Album.slug == slug).first():
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")

    album = Album(
    **data.model_dump(exclude={"slug"}),
    slug=slug, 
    )


    db.add(album)
    db.commit()
    db.refresh(album)

    return BaseResponse(status="success", message="Tạo album thành công", data=AlbumResponse.model_validate(album))

@router.get("/", response_model=BaseResponse)
def get_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).order_by(Album.created_at.desc()).all()
    return BaseResponse(status="success", message="Danh sách album", data=[AlbumResponse.model_validate(a) for a in albums])

@router.get("/{album_id}", response_model=BaseResponse)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")
    return BaseResponse(status="success", message="Chi tiết album", data=AlbumResponse.model_validate(album))

@router.put("/{album_id}", response_model=BaseResponse)
def update_album(album_id: int, data: AlbumCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(album, key, value)
    db.commit()
    db.refresh(album)

    return BaseResponse(status="success", message="Cập nhật album thành công", data=AlbumResponse.model_validate(album))

@router.delete("/{album_id}", response_model=BaseResponse)
def delete_album(album_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Album không tồn tại")

    db.delete(album)
    db.commit()

    return BaseResponse(status="success", message="Xóa album thành công")
