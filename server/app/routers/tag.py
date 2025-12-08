from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from slugify import slugify
from app.config.database import get_db
from app.config.security import get_current_admin
from app.models.tag import Tag
from app.schemas.response import BaseResponse
from app.schemas.tag import TagCreate, TagResponse, TagUpdate

router = APIRouter(prefix="/api/tags", tags=["Tags"])

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
    slug = slugify(body.name)

    existing = db.query(Tag).filter(Tag.slug == slug).first()
    if existing:
        return BaseResponse(
            status="success",
            message="Tag đã tồn tại",
            data=TagResponse.model_validate(existing)
        )

    tag = Tag(name=body.name, slug=slug)
    db.add(tag)
    db.commit()
    db.refresh(tag)

    return BaseResponse(
        status="success",
        message="Tạo tag thành công",
        data=TagResponse.model_validate(tag)
    )
# PUT update existing tag (admin only)
@router.put("/{tag_id}", response_model=BaseResponse)
def update_tag(
    tag_id: int,
    body: TagUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag không tồn tại")

    tag.name = body.name
    tag.slug = slugify(body.name)

    db.commit()
    db.refresh(tag)

    return BaseResponse(
        status="success",
        message="Cập nhật tag thành công",
        data=TagResponse.model_validate(tag)
    )

# DELETE tag (admin only)
@router.delete("/{tag_id}", response_model=BaseResponse)
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag không tồn tại")

    db.delete(tag)
    db.commit()

    return BaseResponse(
        status="success",
        message="Xóa tag thành công",
        data=None
    )
