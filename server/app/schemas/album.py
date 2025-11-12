from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum
class AlbumStatus(str, Enum):
    active = "active"
    archived = "archived"
    draft = "draft"
class AlbumBase(BaseModel):
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[AlbumStatus] = AlbumStatus.active
class AlbumCreate(AlbumBase):
    pass
class AlbumResponse(AlbumBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
