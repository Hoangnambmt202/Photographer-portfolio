from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
from sqlalchemy import Enum
import enum
photo_tags = Table(
    "photo_tags",
    Base.metadata,
    Column("photo_id", Integer, ForeignKey("photos.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
)
class PhotoStatus(enum.Enum):
    public = "public"
    private = "private"
    archived = "archived"
    draft = "draft"
class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=True)
    slug = Column(String(150), unique=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=False)
    taken_at = Column(Date, nullable=True)
    location = Column(String(150), nullable=True)
    status = Column(Enum(PhotoStatus), default=PhotoStatus.draft, nullable=False)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    order = Column(Integer, nullable=True, server_default='0')  # For sorting photos in album
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ
    album = relationship("Album", back_populates="photos", foreign_keys=[album_id])
    user = relationship("User", back_populates="photos")
    tags = relationship("Tag", secondary="photo_tags", back_populates="photos")
