from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime


class SettingBase(BaseModel):
    site_name: str  # Chỉ field này là bắt buộc

    # Tất cả các field khác là optional
    site_description: Optional[str] = None
    logo_url: Optional[str] = None
    theme: Optional[str] = "light"
    language: Optional[str] = "vi"
    currency: Optional[str] = "VND"
    timezone: Optional[str] = "Asia/Ho_Chi_Minh"
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    is_maintenance: Optional[bool] = False
    settings: Optional[Dict[str, Any]] = {}


class SettingCreate(SettingBase):
    # Kế thừa từ SettingBase, tất cả đã optional trừ site_name
    pass


class SettingUpdate(BaseModel):
    # Cho phép update từng field, tất cả optional
    site_name: Optional[str] = None
    site_description: Optional[str] = None
    logo_url: Optional[str] = None
    theme: Optional[str] = None
    language: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    is_maintenance: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

    class Config:
        # Cho phép tạo object với các field tuỳ chọn
        from_attributes = True


class SettingResponse(SettingBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
