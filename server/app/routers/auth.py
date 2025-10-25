from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.config.database import SessionLocal, get_db
from app import models
from app.config.security import verify_password, hash_password
from app.config.jwt import create_access_token, decode_access_token
from app.schemas import auth, user
from datetime import timedelta
from app.config.jwt import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ----------------------
# Đăng ký người dùng
# ----------------------
@router.post("/register", response_model=user.UserResponse)
def register_user(user: user.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    db_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ----------------------
# Đăng nhập và tạo token
# ----------------------
@router.post("/login", response_model=auth.TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token({"sub": str(user.id)}, access_token_expires)
    return {"access_token": token, "token_type": "bearer"}

# ----------------------
# Lấy thông tin user hiện tại (me)
# ----------------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user_id: str = payload.get("sub")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
    return user

@router.get("/me", response_model=user.UserResponse)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
