// components/services/ServiceCard.tsx
import { Service } from "@/types/service.types";
import { Eye, Edit2, Trash2, Users, Clock, Tag, Percent } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: Service;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  formatCurrency: (amount: number) => string;
}

export default function ServiceCard({
  service,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  formatCurrency,
}: ServiceCardProps) {
  // Tính giá sau giảm
  const finalPrice = service.final_price || service.price;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header với hình ảnh */}
      <div className="h-48 relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        {service.cover_image ? (
          <Image
            width={100}
            height={100} 
            src={service.cover_image} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Chưa có hình ảnh</span>
          </div>
        )}
        
        {/* Badge trạng thái */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onToggleActive(service.id)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.status === 'active' 
                ? "bg-green-500 text-white" 
                : service.status === 'inactive'
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {service.status === 'active' ? "Hoạt động" : 
             service.status === 'inactive' ? "Tạm dừng" : "Bản nháp"}
          </button>
          
          {service.is_featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
              Nổi bật
            </span>
          )}
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {service.category?.name || service.category?.slug}
          </span>
        </div>
        
        {/* Discount badge */}
        {service.discount_percent > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
              <Percent className="w-3 h-3" />
              -{service.discount_percent}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        {/* Price display */}
        <div className="mb-4">
          {service.discount_percent > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-500 line-through">
                {formatCurrency(service.price)}
              </span>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          ) : (
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(service.price)}
            </div>
          )}
        </div>

        {/* Service details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{service.duration} giờ</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{service.max_people === 0 || !service.max_people ? "Không giới hạn" : `${service.max_people} người (Tối đa)`}</span>
          </div>
          {service.display_order > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Thứ tự: {service.display_order}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id} 
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
              </span>
            ))}
            {service.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{service.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(service)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" /> Xem
          </button>
          <button
            onClick={() => onEdit(service)}
            className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}