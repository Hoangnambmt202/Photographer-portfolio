from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True)

    photos = relationship("Photo", secondary="photo_tags", back_populates="tags")
    # albums relationship will be added via back_populates in Album model
    albums = relationship("Album", secondary="album_tags", back_populates="tags")
