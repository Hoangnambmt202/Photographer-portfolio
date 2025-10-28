from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    cover_image = Column(String(255), nullable=True)
    status = Column(String(50), default="active")  # active, archived, draft
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Khóa ngoại liên kết Category
    category_id = Column(Integer, ForeignKey("categories.id"))

    # Quan hệ ngược: mỗi Album thuộc 1 Category
    category = relationship("Category", back_populates="albums")

    photos = relationship("Photo", back_populates="album", cascade="all, delete")
