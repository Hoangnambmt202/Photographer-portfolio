from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlbumBase(BaseModel):
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "active"
    cover_image: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass

class AlbumResponse(AlbumBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
