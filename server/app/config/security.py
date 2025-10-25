# app/core/security.py
from pwdlib import PasswordHash

# Khởi tạo với Argon2
pwd_context = PasswordHash.recommended()

def hash_password(password: str) -> str:
    """Mã hóa mật khẩu"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu"""
    return pwd_context.verify(plain_password, hashed_password)
