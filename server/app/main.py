
import uvicorn  
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import Base, engine
from app.routers import user, album, photo, contact, auth, category, setting

# Import models để Alembic biết
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Photographer Portfolio API")

origins = [
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
app.include_router(user.router)
app.include_router(album.router)
app.include_router(photo.router)
app.include_router(contact.router)
app.include_router(auth.router)
app.include_router(category.router)
app.include_router(setting.router)


@app.get("/")
def root():
    return {"message": "Welcome to Photographer Portfolio API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)