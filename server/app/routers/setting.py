from fastapi import APIRouter, Depends, HTTPException, status  # type: ignore
from sqlalchemy.orm import Session
from app.config.security import get_current_admin
from app.config.database import get_db
from app.models.setting import Setting
from app.schemas.setting import SettingCreate, SettingResponse
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/settings", tags=["Settings"])

# -----------------------------
# Tạo hoặc cập nhật cấu hình website
# (chỉ có 1 record duy nhất)
# -----------------------------
@router.post("/", response_model=BaseResponse)
def create_or_update_setting(data: SettingCreate, db: Session = Depends(get_db),current_admin = Depends(get_current_admin)):
    setting = db.query(Setting).first()

    if not setting:
        setting = Setting(**data.model_dump())
        db.add(setting)
        db.commit()
        db.refresh(setting)
        message = "Tạo mới cấu hình website thành công"
    else:
        for key, value in data.model_dump().items():
            setattr(setting, key, value)
        db.commit()
        db.refresh(setting)
        message = "Cập nhật cấu hình website thành công"

    return BaseResponse(
        status="success",
        message=message,
        data=SettingResponse.model_validate(setting)
    )

# -----------------------------
# Lấy thông tin cấu hình website
# -----------------------------
@router.get("/", response_model=BaseResponse)
def get_setting(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    setting = db.query(Setting).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Chưa có cấu hình website")

    return BaseResponse(
        status="success",
        message="Lấy cấu hình website thành công",
        data=SettingResponse.model_validate(setting)
    )
