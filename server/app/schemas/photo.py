from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
class PhotoStatus(str, Enum):
    public = "public"
    private = "private"
    archived = "archived"
    draft = "draft"
class PhotoBase(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    taken_at: Optional[date] = None
    location: Optional[str] = None
    status: Optional[PhotoStatus] = PhotoStatus.draft

class PhotoCreate(PhotoBase):
    album_id: Optional[int] = None
    user_id: Optional[int] = None
    tag_ids: Optional[List[int]] = []

class PhotoResponse(PhotoBase):
    id: int
    album_id: Optional[int]
    user_id: Optional[int]
    created_at: datetime
    tags: List[str] = []

    class Config:
        from_attributes = True
