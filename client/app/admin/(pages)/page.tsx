"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Camera,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  FolderOpen,
  Eye,
  Send,
  ImageIcon,
} from "lucide-react";

export default function Dashboard() {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateStats(true), 300);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-gray-600 text-lg">
            Chào mừng trở lại! Hôm nay là{" "}
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group"
            >
              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <motion.p
                      className="text-4xl font-bold text-gray-900"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <AnimatedCounter value={stat.value} />
                    </motion.p>
                  </div>
                  <motion.div
                    className={`p-3 bg-linear-to-br ${stat.color} rounded-xl shadow-lg`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp
                    className={`w-4 h-4 mr-1 ${
                      stat.trendUp ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={stat.trendUp ? "text-green-600" : "text-red-600"}
                  >
                    {stat.trend}
                  </span>
                  <span className="text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className="h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Lịch hẹn sắp tới và doanh thu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Bookings */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2"
          >
            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-cyan-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Lịch hẹn sắp tới
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b ${booking.color}`}
                    />
                    <div className="flex items-start justify-between mb-3 ml-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.client}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.type}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r ${booking.color} text-white`}
                      >
                        {booking.time}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 ml-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {booking.date}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Doanh thu 6 tháng
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between h-48 space-x-2">
                {revenueData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <motion.div
                      className="w-full bg-linear-to-t from-green-500 to-emerald-400 rounded-t-lg relative group cursor-pointer"
                      initial={{ height: 0 }}
                      animate={{ height: `${data.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.value}M
                      </div>
                    </motion.div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      {data.month}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        {/* Tình trạng ảnh và trạng thái album */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Status */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-yellow-50 to-orange-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" width={24} height={24} />
                Tình trạng ảnh
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {photoStatus.map((status, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ x: 8 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${status.color}`}>
                      <status.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {status.label}
                      </p>
                      <p className="text-sm text-gray-500">Đang chờ xử lý</p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.7, type: "spring" }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {status.count}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Album Status */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2"
          >
            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FolderOpen className="w-6 h-6 mr-2" />
                Trạng thái Album
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {albumStatus.map((album, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {album.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {album.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        album.progress === 100
                          ? "bg-green-100 text-green-700"
                          : album.progress >= 60
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {album.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-semibold text-gray-900">
                        {album.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          album.progress === 100
                            ? "bg-linear-to-r from-green-500 to-emerald-500"
                            : album.progress >= 60
                            ? "bg-linear-to-r from-blue-500 to-cyan-500"
                            : "bg-linear-to-r from-yellow-500 to-orange-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${album.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
