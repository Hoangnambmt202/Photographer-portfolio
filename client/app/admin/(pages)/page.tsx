
import { Image, FolderOpen, Mail, Users, } from 'lucide-react';

export default function Dashboard() {
    const stats = [
    { label: 'Tổng ảnh', value: '1,234', icon: Image, color: 'blue' },
    { label: 'Albums', value: '45', icon: FolderOpen, color: 'green' },
    { label: 'Khách hàng', value: '128', icon: Users, color: 'purple' },
    { label: 'Liên hệ', value: '89', icon: Mail, color: 'orange' },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Ảnh gần đây</h2>
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-semibold">Tiêu đề ảnh {i}</p>
                  <p className="text-sm text-gray-500">Uploaded 2 ngày trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Liên hệ gần đây</h2>
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Email khách {i}</p>
                  <p className="text-sm text-gray-500">message@example.com</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Xem</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
