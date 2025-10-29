from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from slugify import slugify
from app.config.database import SessionLocal, get_db
from app import models
from app.schemas import photo

router = APIRouter(prefix="/photos", tags=["Photos"])

@router.post("/", response_model=photo.PhotoResponse)
def create_photo(photo: photo.PhotoCreate, db: Session = Depends(get_db)):
    new_photo = models.Photo(
        title=photo.title,
        slug=slugify(photo.title),
        description=photo.description,
        image_url=photo.image_url,
        taken_at=photo.taken_at,
        location=photo.location,
        album_id=photo.album_id,
        user_id=photo.user_id
    )
    # Gán tag nếu có
    if photo.tag_ids:
        tags = db.query(models.Tag).filter(models.Tag.id.in_(photo.tag_ids)).all()
        new_photo.tags.extend(tags)
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo

@router.get("/", response_model=list[photo.PhotoResponse])
def list_photos(db: Session = Depends(get_db)):
    photos = db.query(models.Photo).all()
    return [
        photo.PhotoResponse(
            id=p.id,
            title=p.title,
            slug=p.slug,
            description=p.description,
            image_url=p.image_url,
            taken_at=p.taken_at,
            location=p.location,
            album_id=p.album_id,
            user_id=p.user_id,
            created_at=p.created_at,
            tags=[t.name for t in p.tags]
        )
        for p in photos
    ]
