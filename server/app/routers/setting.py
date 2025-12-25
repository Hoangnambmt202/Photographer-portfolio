from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.setting import Setting
from app.schemas.setting import SettingCreate, SettingUpdate, SettingResponse
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/api/settings", tags=["Settings"])


# GET ALL: lấy tất cả setting
@router.get("", response_model=BaseResponse)
def get_setting(db: Session = Depends(get_db)):
    setting = db.query(Setting).first()
    if not setting:
        raise HTTPException(404, "Settings not found")
    return BaseResponse(
        status="success",
        message="Danh sách cài đặt",
        data=SettingResponse.model_validate(setting),
    )


# POST Settings: Tạo config settings
@router.post("", response_model=BaseResponse)
def create_setting(payload: SettingCreate, db: Session = Depends(get_db)):
    setting = Setting(**payload.model_dump())
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return BaseResponse(
        status="success",
        message="Tạo cài đặt mới thành công",
        data=SettingResponse.model_validate(setting),
    )


# UPDATE SETTINGS: cập nhật dữ liệu settings
@router.put("/{setting_id}", response_model=BaseResponse)
def update_setting(
    setting_id: int, payload: SettingUpdate, db: Session = Depends(get_db)
):
    setting = db.query(Setting).get(setting_id)
    if not setting:
        raise HTTPException(404, "Settings not found")

    # Chỉ update các field có giá trị (không phải None)
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(setting, key, value)

    db.commit()
    db.refresh(setting)
    return BaseResponse(
        status="success",
        message="Update setting thành công",
        data=SettingResponse.model_validate(setting),
    )
