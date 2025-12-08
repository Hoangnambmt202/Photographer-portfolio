from pydantic import BaseModel

class TagResponse(BaseModel):
    id: int
    name: str
    slug: str
    
    class Config:
        from_attributes = True

class TagCreate(BaseModel):
    name: str

class TagUpdate(BaseModel):
    name: str
