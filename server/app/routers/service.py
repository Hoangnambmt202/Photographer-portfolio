from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from slugify import slugify
from typing import Optional, List
from pydantic import BaseModel
import math

from app.config.database import get_db
from app.config.security import get_current_admin
from app.models.service import Service, ServiceStatus
from app.models.tag import Tag
from app.models.category import Category
from app.schemas.service import (
    ServiceResponse,
    ServiceCreate,
    ServiceUpdateRequest,
    ServiceStatus as ServiceStatusEnum,
)
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/api/services", tags=["Services"])


@router.post("", response_model=BaseResponse)
async def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    # Tạo slug từ name
    base_slug = slugify(service_data.name)
    slug = base_slug
    counter = 1

    # Đảm bảo slug là unique
    while db.query(Service).filter(Service.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Tạo service
    service = Service(
        name=service_data.name,
        slug=slug,
        description=service_data.description,
        price=service_data.price,
        duration=service_data.duration,
        max_people=service_data.max_people,
        included_items=service_data.included_items,
        status=service_data.status,
        category_id=service_data.category_id,
        cover_image=service_data.cover_image,
        discount_percent=service_data.discount_percent,
        is_featured=service_data.is_featured,
        display_order=service_data.display_order,
        user_id=current_admin.id,  # Gán photographer hiện tại
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    # Xử lý tags nếu có
    if service_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(service_data.tag_ids)).all()
        service.tags = tags
        db.commit()
        db.refresh(service)

    return BaseResponse(
        status="success",
        message="Tạo dịch vụ thành công",
        data=ServiceResponse.model_validate(service),
    )


# GET /services
class PaginatedServices(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: list[ServiceResponse]


@router.get("", response_model=PaginatedServices)
def get_services(
    search: Optional[str] = Query(None, description="Từ khóa tìm kiếm"),
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    tag_id: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    featured: Optional[bool] = None,
    page: int = Query(1, ge=1, description="Số trang hiện tại"),
    limit: int = Query(10, ge=1, le=100, description="Số bản ghi mỗi trang"),
    db: Session = Depends(get_db),
):
    query = db.query(Service)

    # Áp dụng các bộ lọc
    if search:
        query = query.filter(Service.name.ilike(f"%{search}%"))

    if status:
        query = query.filter(Service.status == status)

    if category_id:
        query = query.filter(Service.category_id == category_id)

    if tag_id:
        query = query.filter(Service.tags.any(Tag.id == tag_id))

    if min_price is not None:
        query = query.filter(Service.price >= min_price)

    if max_price is not None:
        query = query.filter(Service.price <= max_price)

    if featured is not None:
        query = query.filter(Service.is_featured == featured)

    # Chỉ lấy dịch vụ active cho client (nếu không phải admin)
    # if not current_admin:
    #     query = query.filter(Service.status == ServiceStatus.active)

    total = query.count()
    offset = (page - 1) * limit
    total_pages = (total + limit - 1) // limit
    # Sắp xếp theo created_at (mới nhất trước)
    services = (
        query.order_by(Service.display_order.asc(), Service.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return PaginatedServices(
        total=total, page=page, limit=limit, total_pages=total_pages, data=services
    )


@router.get("/{service_id}", response_model=BaseResponse)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

    return BaseResponse(
        status="success",
        message="Chi tiết dịch vụ",
        data=ServiceResponse.model_validate(service),
    )


@router.put("/{service_id}", response_model=BaseResponse)
async def update_service(
    service_id: int,
    request: ServiceUpdateRequest,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

    # Cập nhật các trường cơ bản
    update_fields = [
        "name",
        "description",
        "price",
        "duration",
        "max_people",
        "included_items",
        "status",
        "category_id",
        "cover_image",
        "discount_percent",
        "is_featured",
        "display_order",
    ]

    for field in update_fields:
        value = getattr(request, field)
        if value is not None:
            setattr(service, field, value)

    # Nếu cập nhật name, cập nhật slug
    if request.name:
        service.slug = slugify(request.name)

    # Cập nhật tags nếu có
    if request.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(request.tag_ids)).all()
        service.tags = tags

    db.commit()
    db.refresh(service)

    return BaseResponse(
        status="success",
        message="Cập nhật dịch vụ thành công",
        data=ServiceResponse.model_validate(service),
    )


@router.patch("/{service_id}/status", response_model=BaseResponse)
def update_service_status(
    service_id: int,
    status: ServiceStatusEnum,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

    service.status = status
    db.commit()

    return BaseResponse(
        status="success",
        message=f"Cập nhật trạng thái dịch vụ thành {status.value}",
        data=ServiceResponse.model_validate(service),
    )


@router.delete("/{service_id}", response_model=BaseResponse)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

    db.delete(service)
    db.commit()

    return BaseResponse(
        status="success",
        message="Xóa dịch vụ thành công",
    )


@router.post("/{service_id}/upload-cover", response_model=BaseResponse)
async def upload_service_cover(
    service_id: int,
    cover_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Dịch vụ không tồn tại")

    # Upload ảnh lên Cloudinary (giống như album/photo)
    try:
        import cloudinary.uploader

        upload_result = cloudinary.uploader.upload(
            cover_image.file, folder="photographer_services", resource_type="image"
        )
        service.cover_image = upload_result.get("secure_url")
        db.commit()

        return BaseResponse(
            status="success",
            message="Upload ảnh cover thành công",
            data=ServiceResponse.model_validate(service),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi upload ảnh: {str(e)}")
