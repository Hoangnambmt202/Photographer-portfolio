from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.config.database import get_db
from app import models
from app.config.security import verify_password, hash_password, get_current_user
from app.config.jwt import create_access_token, decode_token, create_refresh_token
from app.schemas import auth, user
from app.schemas.user import UserResponse
from app.schemas.auth import RefreshRequest
from datetime import timedelta
from app.config.jwt import ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.response import BaseResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ----------------------
# Đăng ký người dùng
# ----------------------
@router.post("/register", response_model=BaseResponse)
def register_user(user: user.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    hashed_password = hash_password(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password=hashed_password,
        is_admin=user.is_admin,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return BaseResponse(
        status="success",
        message="Đăng ký người dùng thành công",
        data=UserResponse.model_validate(new_user)
    )

# ----------------------
# Đăng nhập và tạo token
# ----------------------
@router.post("/login", response_model=BaseResponse)
def login(data: auth.LoginRequest,response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        return BaseResponse(status="error", message="Email không tồn tại")

    if not verify_password(data.password, user.password):
        return BaseResponse(status="error", message="Sai mật khẩu")

    # Tạo access_token (hết hạn sau X phút)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    # Tạo refresh_token (hết hạn lâu hơn)
    refresh_token = create_refresh_token(
        data={"sub": str(user.id)}, expires_delta=timedelta(days=7)
    )
    # Gửi cookie xuống client
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,     # Không thể truy cập bằng JS
        secure=False,      # Đặt True nếu dùng HTTPS
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 ngày
        path="/",
    )
    return BaseResponse(
        status="success",
        message="Đăng nhập thành công",
        data=UserResponse.model_validate(user),
    )

# ----------------------
# Lấy thông tin user hiện tại (me)
# ----------------------
@router.get("/me", response_model=BaseResponse)
def read_me(current_user: models.User = Depends(get_current_user)):
    return BaseResponse(
        status="success",
        message="Lấy thông tin người dùng thành công",
        data={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "is_admin": current_user.is_admin
        }
    )
#---------------
# Làm mới access token bằng refresh token
# ----------------------
@router.post("/refresh", response_model=BaseResponse)
def refresh_token(response: Response, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return BaseResponse(status="error", message="Không có refresh token trong cookie")

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        return BaseResponse(status="error", message="Refresh token không hợp lệ hoặc đã hết hạn")

    user_id = payload.get("sub")
    new_access_token = create_access_token(data={"sub": str(user_id)})

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return BaseResponse(
        status="success",
        message="Làm mới access token thành công",
        data={"access_token": new_access_token},
    )

@router.post("/logout", response_model=BaseResponse)
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return BaseResponse(status="success", message="Đăng xuất thành công")
