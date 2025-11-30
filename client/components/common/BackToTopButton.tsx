
"use client";

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react'; // Gói icon gọn nhẹ, hoặc dùng SVG

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 1. Lắng nghe sự kiện cuộn (scroll)
  useEffect(() => {
    // Hàm kiểm tra vị trí cuộn
    const toggleVisibility = () => {
      if (window.scrollY > 300) { // Hiện nút nếu cuộn qua 300px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Thêm listener khi component mount
    window.addEventListener('scroll', toggleVisibility);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 2. Hàm xử lý khi click: Cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Cuộn mượt mà
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
    
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          p-3 rounded-full bg-black text-white shadow-lg
          transition-all duration-300 ease-in-out
          hover:bg-black-400 hover:scale-110
          focus:outline-none focus:ring-2 border-white focus:ring-opacity-50
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
        `}
        aria-label="Cuộn lên đầu trang"
      >
        {/* Bạn có thể thay icon này bằng SVG tự custom */}
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default BackToTopButton;