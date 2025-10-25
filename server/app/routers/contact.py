from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import SessionLocal, get_db
from app import models
from app.schemas import contact

router = APIRouter(prefix="/contacts", tags=["Contacts"])


@router.post("/", response_model=contact.ContactResponse)
def create_contact(contact: contact.ContactCreate, db: Session = Depends(get_db)):
    new_contact = models.Contact(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.get("/", response_model=list[contact.ContactResponse])
def list_contacts(db: Session = Depends(get_db)):
    return db.query(models.Contact).all()
