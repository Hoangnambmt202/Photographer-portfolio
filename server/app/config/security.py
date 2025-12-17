from pwdlib import PasswordHash
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.config.jwt import decode_token
from app.models import User
from app.config.database import get_db

# ==============================
# Cấu hình bảo mật
# ==============================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = PasswordHash.recommended()


# ==============================
# Xử lý mật khẩu
# ==============================
def hash_password(password: str) -> str:
    """Mã hóa mật khẩu bằng Argon2"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu"""
    return pwd_context.verify(plain_password, hashed_password)


# ==============================
# Lấy thông tin user từ Bearer token
# ==============================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Giải mã JWT từ header Authorization: Bearer.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực thông tin đăng nhập",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise credentials_exception

    return user


# ==============================
# Kiểm tra quyền admin
# ==============================
def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Middleware kiểm tra quyền admin.
    Dùng làm dependency cho router admin.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập chức năng này"
        )
    return current_user
