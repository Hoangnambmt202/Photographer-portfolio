from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ServiceStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    draft = "draft"


class ServiceTagResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class ServiceCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    duration: Optional[str] = None
    max_people: Optional[int] = None
    included_items: Optional[str] = None
    status: ServiceStatus = ServiceStatus.active
    category_id: Optional[int] = None
    cover_image: Optional[str] = None
    discount_percent: int = 0
    is_featured: bool = False
    display_order: int = 0


class ServiceCreate(ServiceBase):
    tag_ids: Optional[List[int]] = []


class ServiceUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    duration: Optional[str] = None
    max_people: Optional[int] = None
    included_items: Optional[str] = None
    status: Optional[ServiceStatus] = None
    category_id: Optional[int] = None
    cover_image: Optional[str] = None
    tag_ids: Optional[List[int]] = None
    discount_percent: Optional[int] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


class ServiceResponse(ServiceBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: List[ServiceTagResponse] = []
    category: Optional[ServiceCategoryResponse] = None
    # Tính giá sau giảm giá
    final_price: int = 0

    class Config:
        from_attributes = True

    @classmethod
    def model_validate(cls, obj):
        data = super().model_validate(obj)
        # Tính final price
        data.final_price = data.price * (100 - data.discount_percent) // 100
        return data
