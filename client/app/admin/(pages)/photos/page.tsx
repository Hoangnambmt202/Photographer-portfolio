import Pagination from "@/components/common/pagination";
import { Download, Eye, Trash2, Upload } from "lucide-react";

export default function PhotosPage() {
     return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ảnh</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Upload className="w-5 h-5" />
          <span>Upload Ảnh</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tất cả Albums</option>
            <option>Album Wedding</option>
            <option>Album Fashion / Art</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tất cả danh mục</option>
            <option>Wedding</option>
            <option>Thể thao</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
            <div className="relative h-48 bg-gray-200">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button className="p-2 bg-white rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white rounded-lg text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-sm truncate">Ảnh {i + 1}</p>
              <p className="text-xs text-gray-500">1920x1080</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination/>
    </div>
  );
}