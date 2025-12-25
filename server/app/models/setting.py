from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from app.config.database import Base


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    # Core settings
    site_name = Column(String(150), nullable=False)
    site_description = Column(Text, nullable=True)
    logo_url = Column(String(255), nullable=True)

    theme = Column(String(20), default="light")
    language = Column(String(10), default="vi")
    currency = Column(String(10), default="VND")
    timezone = Column(String(50), default="Asia/Ho_Chi_Minh")

    contact_email = Column(String(150), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)

    is_maintenance = Column(Boolean, default=False)

    # Dynamic settings
    settings = Column(JSONB, default=dict)

    updated_by = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
