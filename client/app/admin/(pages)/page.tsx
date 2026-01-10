"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Camera,
  Calendar,
  DollarSign,
  CheckCircle,
  TrendingUp,
  FolderOpen,
  Eye,
  Send,
  ImageIcon,
  MoreHorizontal,
} from "lucide-react";

export default function Dashboard() {
  const [animateStats, setAnimateStats] = useState(false);
    useEffect(() => { setTimeout(() => setAnimateStats(true), 300); }, []);

  // Mock data
  const stats = [
    {
      label: "Tổng khách hàng",
      value: 156,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Tổng buổi chụp",
      value: 89,
      icon: Camera,
      color: "from-purple-500 to-purple-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Booking tuần này",
      value: 12,
      icon: Calendar,
      color: "from-green-500 to-green-600",
      trend: "+3",
      trendUp: true,
    },
    {
      label: "Doanh thu tháng này",
      value: "45.2M",
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      trend: "+18%",
      trendUp: true,
    },
  ];

  const photoStatus = [
    {
      label: "Cần duyệt",
      count: 234,
      icon: Eye,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Cần gửi khách",
      count: 45,
      icon: Send,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Đã hoàn tất",
      count: 567,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
  ];

  const albumStatus = [
    {
      title: "Đám cưới Lan - Minh",
      progress: 85,
      status: "Đang xử lý",
      date: "28/11/2024",
    },
    {
      title: "Pre-wedding Thu - Nam",
      progress: 100,
      status: "Hoàn tất",
      date: "25/11/2024",
    },
    {
      title: "Chụp gia đình Nguyễn",
      progress: 60,
      status: "Đang chỉnh sửa",
      date: "01/12/2024",
    },
    {
      title: "Sự kiện công ty ABC",
      progress: 30,
      status: "Mới bắt đầu",
      date: "05/12/2024",
    },
  ];

  const upcomingBookings = [
    {
      client: "Trần Văn A",
      type: "Đám cưới",
      time: "09:00",
      date: "30/11/2024",
      color: "from-pink-500 to-rose-500",
    },
    {
      client: "Nguyễn Thị B",
      type: "Chân dung",
      time: "14:00",
      date: "30/11/2024",
      color: "from-blue-500 to-cyan-500",
    },
    {
      client: "Lê Văn C",
      type: "Gia đình",
      time: "10:00",
      date: "01/12/2024",
      color: "from-green-500 to-emerald-500",
    },
    {
      client: "Phạm Thị D",
      type: "Pre-wedding",
      time: "08:00",
      date: "02/12/2024",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const revenueData = [
    { month: "T7", value: 65 },
    { month: "T8", value: 75 },
    { month: "T9", value: 55 },
    { month: "T10", value: 85 },
    { month: "T11", value: 95 },
    { month: "T12", value: 70 },
  ];

  const AnimatedCounter = ({ value }: { value: number | string }) => {
    const [count, setCount] = useState(0);
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    useEffect(() => {
      if (!animateStats) return;
      let start = 0;
      const end = numValue;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [numValue]);

    return <>{typeof value === "string" ? `${count.toFixed(1)}M` : count}</>;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-sm font-medium">
            + Tạo Booking Mới
        </button>
      </motion.div>

      {/* Stats Grid - Responsive 1 -> 2 -> 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
             {/* Nội dung card giữ nguyên, chỉ đảm bảo class responsive */}
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                        <AnimatedCounter value={stat.value} />
                    </h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="w-5 h-5" />
                </div>
             </div>
             <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${stat.trendUp ? "text-green-600" : "text-red-600"} flex items-center`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1"/> : null}
                    {stat.trend}
                </span>
                <span className="text-gray-400 ml-2">vs tháng trước</span>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on LG) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Lịch hẹn sắp tới */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500"/> Lịch hẹn sắp tới
                    </h2>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5"/></button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingBookings.map((booking, i) => (
                        <div key={i} className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group cursor-pointer">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${booking.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                {booking.client.charAt(0)}
                            </div>
                            <div className="ml-4 flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{booking.client}</h4>
                                <p className="text-xs text-gray-500">{booking.type} • {booking.time}</p>
                            </div>
                            <div className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                {booking.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trạng thái Album */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                     <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-purple-500"/> Trạng thái Album
                    </h2>
                </div>
                <div className="overflow-x-auto"> {/* QUAN TRỌNG: Cho phép cuộn ngang bảng trên mobile */}
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Tên Album</th>
                                <th className="px-6 py-3">Tiến độ</th>
                                <th className="px-6 py-3">Trạng thái</th>
                                <th className="px-6 py-3">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {albumStatus.map((album, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{album.title}</td>
                                    <td className="px-6 py-4 w-1/3">
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{width: `${album.progress}%`}}></div>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 block">{album.progress}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            album.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' : 
                                            album.status === 'Mới bắt đầu' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {album.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{album.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* Right Column (1/3 width on LG) */}
        <div className="space-y-6">
            
            {/* Revenue Chart (Simple Bars) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500"/> Doanh thu
                </h2>
                <div className="flex items-end justify-between h-48 gap-2">
                    {revenueData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                             <div className="w-full h-40 bg-gray-100 rounded-t-lg relative flex  items-end overflow-visible">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.value}%` }}
                                    className="w-full bg-green-500 opacity-80 group-hover:opacity-100 transition-opacity rounded-t-sm relative"
                                >
                                     {/* Tooltip on hover */}
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        {d.value}M
                                     </div>
                                </motion.div>
                             </div>
                             <span className="text-xs text-gray-400 font-medium">{d.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Photo Status List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-orange-500"/> Tình trạng ảnh
                </h2>
                <div className="space-y-3">
                    {photoStatus.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-').replace('600', '100')} ${item.color}`}>
                                    <item.icon className="w-4 h-4"/>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                            <span className="font-bold text-gray-900">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
