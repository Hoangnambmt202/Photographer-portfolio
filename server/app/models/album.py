from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
from sqlalchemy import Enum
import enum

# Association table for album-tag many-to-many relationship
album_tags = Table(
    "album_tags",
    Base.metadata,
    Column("album_id", Integer, ForeignKey("albums.id", ondelete="CASCADE")),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE")),
)


class AlbumStatus(enum.Enum):
    active = "active"
    archived = "archived"
    draft = "draft"


class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    cover_image = Column(String(255), nullable=True)
    status = Column(Enum(AlbumStatus), default=AlbumStatus.active, nullable=False)
    location = Column(String(255), nullable=True)
    featured_photo_id = Column(
        Integer, ForeignKey("photos.id", ondelete="SET NULL"), nullable=True
    )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Quan hệ
    category = relationship("Category", back_populates="albums")
    photos = relationship(
        "Photo",
        back_populates="album",
        cascade="all, delete",
        foreign_keys="Photo.album_id",
    )
    featured_photo = relationship(
        "Photo", foreign_keys=[featured_photo_id], uselist=False
    )
    user = relationship("User", back_populates="albums")  # Sửa thành "albums" (plural)
    tags = relationship("Tag", secondary=album_tags, back_populates="albums")
