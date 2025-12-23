import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config.database import Base, engine, SessionLocal
from app.routers import (
    user,
    album,
    photo,
    contact,
    auth,
    category,
    setting,
    tag,
    service,
)
from app.models.user import User
from app.config.security import hash_password


# Tạo bảng (nếu chưa có)
Base.metadata.create_all(bind=engine)


# --------------------------
# 🚀 Lifespan (thay thế startup/shutdown)
# --------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()

    admin = db.query(User).filter(User.email == "admin@gmail.com").first()

    if not admin:
        admin = User(
            full_name="Admin",
            email="admin@gmail.com",
            is_admin=True,
            password=hash_password("123456"),
        )
        db.add(admin)
        print("✔ Admin account created!")
    else:
        if not admin.is_admin:
            admin.is_admin = True
            print("🔧 Admin privilege fixed!")

    db.commit()
    db.close()

    yield

    # ----- Shutdown -----
    # (option) đóng kết nối, cleanup nếu cần
    print("🔻 App shutting down...")


app = FastAPI(title="Photographer Portfolio API", lifespan=lifespan)


# --------------------------
# CORS
# --------------------------
origins = [
    "https://taithai.vercel.app",
    "https://photographer-portfolio.vercel.app",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------
# Routers
# --------------------------
app.include_router(user.router)
app.include_router(album.router)
app.include_router(photo.router)
app.include_router(contact.router)
app.include_router(auth.router)
app.include_router(category.router)
app.include_router(setting.router)
app.include_router(tag.router)
app.include_router(service.router)


@app.get("/")
def root():
    return {"message": "Welcome to Photographer Portfolio API"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
