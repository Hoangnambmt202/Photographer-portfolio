from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True)

    # Quan hệ
    photos = relationship("Photo", secondary="photo_tags", back_populates="tags")
    albums = relationship("Album", secondary="album_tags", back_populates="tags")
    services = relationship("Service", secondary="service_tags", back_populates="tags")
