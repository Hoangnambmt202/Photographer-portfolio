from fastapi import APIRouter, Depends, HTTPException, status # type: ignore
from sqlalchemy.orm import Session
from slugify import slugify
from typing import List
from app.config.security import get_current_admin
from app.config.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/api/categories", tags=["Categories"])

# -----------------------------
# Tạo mới Category
# -----------------------------
@router.post("/", response_model=BaseResponse)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    slug = data.slug or slugify(data.name)
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")

    category = Category(name=data.name, slug=slug, description=data.description)
    db.add(category)
    db.commit()
    db.refresh(category)

    return BaseResponse(
        status="success",
        message="Tạo danh mục thành công",
        data=CategoryResponse.model_validate(category)
    )

# -----------------------------
# Lấy tất cả category
# -----------------------------
@router.get("/", response_model=BaseResponse)
def get_all_categories(db: Session = Depends(get_db)) :
    categories = db.query(Category).order_by(Category.created_at.desc()).all()
    return BaseResponse(
        status="success",
        message="Lấy danh sách danh mục thành công",
        data=[CategoryResponse.model_validate(c) for c in categories]
    )

# -----------------------------
# Lấy 1 category
# -----------------------------
@router.get("/{category_id}", response_model=BaseResponse)
def get_category(category_id: int, db: Session = Depends(get_db), ):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại")

    return BaseResponse(
        status="success",
        message="Lấy danh mục thành công",
        data=CategoryResponse.model_validate(category)
    )

# -----------------------------
# Cập nhật category
# -----------------------------
@router.put("/{category_id}", response_model=BaseResponse)
def update_category(category_id: int, data: CategoryCreate, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại")

    category.name = data.name
    category.slug = data.slug or slugify(data.name)
    category.description = data.description
    db.commit()
    db.refresh(category)

    return BaseResponse(
        status="success",
        message="Cập nhật danh mục thành công",
        data=CategoryResponse.model_validate(category)
    )

# -----------------------------
# Xóa category
# -----------------------------
@router.delete("/{category_id}", response_model=BaseResponse)
def delete_category(category_id: int, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại")

    db.delete(category)
    db.commit()

    return BaseResponse(status="success", message="Xóa danh mục thành công")
