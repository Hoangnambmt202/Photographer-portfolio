from typing import List
from pydantic import BaseModel

class ServiceBase(BaseModel):
    name: str
    price: int
    description: str | None = None
    delivered_photos: int | None = None
    sessions: int | None = None
    is_active: bool = True
    category_ids: List[int]

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    pass

class ServiceResponse(BaseModel):
    id: int
    name: str
    price: int
    description: str | None
    delivered_photos: int | None
    sessions: int | None
    is_active: bool
    categories: List[str]

    class Config:
        from_attributes = True
