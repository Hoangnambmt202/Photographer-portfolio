from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlbumBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None

class AlbumCreate(AlbumBase):
    user_id: int

class AlbumResponse(AlbumBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
