// components/services/ServiceCard.tsx
import { Service } from "@/types/service.types";
import { Eye, Edit2, Trash2, Users, DollarSign, Clock, Calendar, Star } from "lucide-react";

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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 relative">
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onToggleActive(service.id)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {service.isActive ? "Hoạt động" : "Tạm dừng"}
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-600">{formatCurrency(service.price)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{service.maxPeople === 0 ? "N/A" : `${service.maxPeople} người`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{service.totalBookings} bookings</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{service.rating}</span>
          <span className="text-xs text-gray-500">({service.totalBookings} đánh giá)</span>
        </div>

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
