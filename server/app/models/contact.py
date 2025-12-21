from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.config.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
