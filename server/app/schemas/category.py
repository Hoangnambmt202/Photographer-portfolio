from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    id: int
    name: str
    

class CategoryCreate(CategoryBase):
    slug: Optional[str] = None


class CategoryResponse(CategoryBase):
    slug: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
