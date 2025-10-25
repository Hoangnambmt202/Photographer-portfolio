from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import SessionLocal, get_db
from app import models
from app.schemas import album

router = APIRouter(prefix="/albums", tags=["Albums"])


@router.post("/", response_model=album.AlbumResponse)
def create_album(album: album.AlbumCreate, db: Session = Depends(get_db)):
    new_album = models.Album(**album.dict())
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    return new_album

@router.get("/", response_model=list[album.AlbumResponse])
def list_albums(db: Session = Depends(get_db)):
    return db.query(models.Album).all()
