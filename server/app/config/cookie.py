import os

ENV = os.getenv("ENV", "development")

IS_PRODUCTION = ENV == "production"

def cookie_config():
    """
    Trả về config cookie phù hợp môi trường
    """
    if IS_PRODUCTION:
        # Cookie cho môi trường thật
        return {
            "httponly": True,
            "secure": True,           
            "samesite": "none",
            "path": "/",
        }
    else:
        # Cookie cho localhost
        return {
            "httponly": True,
            "secure": False,
            "samesite": "lax",          
            "domain": None,             
            "path": "/",
        }
