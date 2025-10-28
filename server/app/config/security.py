from pwdlib import PasswordHash
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.config.jwt import decode_token
from app.models import User
from app.config.database import get_db

# ==============================
# Cấu hình bảo mật
# ==============================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
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
# Lấy thông tin user từ token
# ==============================
def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Đọc token từ cookie (ưu tiên) hoặc từ Authorization header.
    """
    # 1️⃣ Ưu tiên lấy từ cookie
    token = request.cookies.get("access_token")

    # 2️⃣ Nếu không có trong cookie, fallback về header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không có access token"
        )

    # 3️⃣ Giải mã token
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không tìm thấy thông tin người dùng trong token"
        )

    # 4️⃣ Truy vấn DB
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Người dùng không tồn tại"
        )

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
