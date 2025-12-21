# models/service.py
from sqlalchemy import Column, Integer, String, Text, Boolean, BigInteger, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.types import TIMESTAMP
from app.config.database import Base
from sqlalchemy.orm import relationship


class ServiceTag(Base):
    __tablename__ = "service_tags"

    service_id = Column(
        Integer, ForeignKey("services.id", ondelete="CASCADE"), primary_key=True
    )
    tag_id = Column(
        Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    )


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(BigInteger, nullable=False)
    description = Column(Text, nullable=True)

    delivered_photos = Column(Integer, default=0)

    is_visible = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    tags = relationship("Tag", secondary="service_tags", back_populates="services")
