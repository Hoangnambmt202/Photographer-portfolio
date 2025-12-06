from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slugify import slugify
from app.config.database import get_db
from app.config.security import get_current_admin
from app.models.tag import Tag
from app.schemas.response import BaseResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/tags", tags=["Tags"])

class TagResponse(BaseModel):
    id: int
    name: str
    slug: str
    
    class Config:
        from_attributes = True

class TagCreate(BaseModel):
    name: str


# GET all tags (public - no auth required)
@router.get("/", response_model=BaseResponse)
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).order_by(Tag.name).all()
    return BaseResponse(
        status="success",
        message="Danh sách tags",
        data=[TagResponse.model_validate(t) for t in tags]
    )


# POST create new tag (admin only)
@router.post("/", response_model=BaseResponse)
def create_tag(
    body: TagCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    # Check if tag already exists
    slug = slugify(body.name)
    existing = db.query(Tag).filter(Tag.slug == slug).first()
    if existing:
        return BaseResponse(
            status="success",
            message="Tag đã tồn tại",
            data=TagResponse.model_validate(existing)
        )
    
    # Create new tag
    tag = Tag(name=body.name, slug=slug)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    
    return BaseResponse(
        status="success",
        message="Tạo tag thành công",
        data=TagResponse.model_validate(tag)
    )
