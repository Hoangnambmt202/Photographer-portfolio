from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base

photo_tags = Table(
    "photo_tags",
    Base.metadata,
    Column("photo_id", Integer, ForeignKey("photos.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
)

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=False)
    taken_at = Column(Date, nullable=True)
    location = Column(String(150), nullable=True)
    album_id = Column(Integer, ForeignKey("albums.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ
    album = relationship("Album", back_populates="photos")
    user = relationship("User", back_populates="photos")
    tags = relationship("Tag", secondary="photo_tags", back_populates="photos")
