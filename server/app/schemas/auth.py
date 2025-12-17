from fastapi import Form
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginForm(LoginRequest):
    """
    Dùng để nhận form-data (email/password) khi login.
    """
    @classmethod
    def as_form(
        cls,
        email: EmailStr = Form(...),
        password: str = Form(...),
    ):
        return cls(email=email, password=password)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
class RefreshRequest(BaseModel):
    refresh_token: str