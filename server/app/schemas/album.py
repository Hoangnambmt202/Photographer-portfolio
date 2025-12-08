from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum
class AlbumStatus(str, Enum):
    active = "active"
    archived = "archived"
    draft = "draft"

class TagResponse(BaseModel):
    id: int
    name: str
    slug: str
    
    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class AlbumBase(BaseModel):
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[AlbumStatus] = AlbumStatus.active
    featured_photo_id: Optional[int] = None


class AlbumCreate(AlbumBase):
    pass

class AlbumResponse(AlbumBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: List[TagResponse] = []
    photo_quantity: int = 0
    category: Optional[CategoryResponse] = None 

    class Config:
        from_attributes = True
