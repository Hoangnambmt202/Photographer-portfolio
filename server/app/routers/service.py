from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.service import Service
from app.models.category import Category
from app.schemas.service import (
    ServiceCreate, ServiceUpdate, ServiceResponse
)

router = APIRouter(prefix="/services", tags=["Services"])


# Create a new service
@router.post("", response_model=ServiceResponse)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    categories = db.query(Category).filter(
        Category.id.in_(data.category_ids)
    ).all()

    service = Service(
        name=data.name,
        price=data.price,
        description=data.description,
        delivered_photos=data.delivered_photos,
        sessions=data.sessions,
        is_active=data.is_active,
        categories=categories
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return {
        **service.__dict__,
        "categories": [c.name for c in service.categories]
    }

# get service
@router.get("", response_model=list[ServiceResponse])
def list_services(
    is_active: bool | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Service)

    if is_active is not None:
        query = query.filter(Service.is_active == is_active)

    services = query.all()

    return [
        {
            **s.__dict__,
            "categories": [c.name for c in s.categories]
        }
        for s in services
    ]

# Update service
@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db)
):
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(404, "Service not found")

    for field, value in data.model_dump(exclude={"category_ids"}).items():
        setattr(service, field, value)

    service.categories = db.query(Category).filter(
        Category.id.in_(data.category_ids)
    ).all()

    db.commit()
    db.refresh(service)

    return {
        **service.__dict__,
        "categories": [c.name for c in service.categories]
    }
