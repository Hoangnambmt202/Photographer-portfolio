from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import SessionLocal
from app import models
from app.schemas import user
from app.config.security import hash_password
from app.config.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=user.UserResponse)
def create_user(user: user.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = models.User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=list[user.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()
