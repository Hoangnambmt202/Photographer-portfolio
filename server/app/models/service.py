from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
from sqlalchemy import Enum
import enum

# Association table for service-tag many-to-many relationship
service_tags = Table(
    "service_tags",
    Base.metadata,
    Column("service_id", Integer, ForeignKey("services.id", ondelete="CASCADE")),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE")),
)


class ServiceStatus(enum.Enum):
    active = "active"
    inactive = "inactive"
    draft = "draft"


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)  # Giá trị số (VNĐ)
    duration = Column(String(50), nullable=True)  # Thời lượng dịch vụ (VD: "2 giờ")
    max_people = Column(Integer, nullable=True)  # Số người tối đa
    included_items = Column(Text, nullable=True)  # Các mục bao gồm, phân cách bằng dấu phẩy
    status = Column(Enum(ServiceStatus), default=ServiceStatus.active, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Photographer owner
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Quan hệ
    category = relationship("Category", back_populates="services")
    user = relationship("User", back_populates="services")
    tags = relationship("Tag", secondary=service_tags, back_populates="services")
    
    # Thêm trường cho hình ảnh đại diện dịch vụ (optional)
    cover_image = Column(String(255), nullable=True)
    # Thêm trường thứ tự hiển thị
    display_order = Column(Integer, default=0)
    # Thêm trường cho ưu đãi/giảm giá
    discount_percent = Column(Integer, default=0)  # Phần trăm giảm giá
    is_featured = Column(Boolean, default=False)  # Dịch vụ nổi bật