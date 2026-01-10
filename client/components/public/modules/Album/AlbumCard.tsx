import { motion, Variants } from "framer-motion";
import { useState } from "react";

interface AlbumCardProps {
  title: string;
  count: number;
  coverImage: string;
  hueA: number;
  hueB: number;
  index: number;
}

// Cấu hình chuyển động giống hệt video mẫu
const cardVariants: Variants = {
  offscreen: {
    y: 300, // Vị trí ban đầu: Nằm thụt sâu xuống dưới
    rotate: 0,
    opacity: 1
  },
  onscreen: {
    y: 50, // Vị trí kết thúc: Trồi lên
    rotate: -10, // Xoay nhẹ giống video
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4, // Độ nảy
      duration: 1,
    },
  },
};

const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

const AlbumCard = ({ title, count, coverImage, hueA, hueB }: AlbumCardProps) => {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex justify-center items-center h-[450px] overflow-hidden" // Set chiều cao cố định cho container để có không gian trồi lên
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8, once: false }} // Quan trọng: Đợi thấy 80% khung mới kích hoạt
    >
      {/* 1. Phần nền (Splash) - Đóng vai trò là "Container" phía sau */}
      <div
        className="absolute w-[300px] h-[430px] " // Kích thước cố định khớp với card để căn chỉnh
        style={{
          background,
          // Clip-path tạo hình giọt nước/bao thư
          clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
          transform: "scale(1.2) translateY(20px)", // Phóng to nền một chút để bao trọn card
        }}
      />

      {/* 2. Phần Card (Album) - Đối tượng sẽ "trồi lên" */}
      <motion.div
        variants={cardVariants}
        className="relative z-10 w-[300px] h-[430px] flex flex-col bg-white rounded-[20px] shadow-2xl overflow-hidden cursor-pointer"
        style={{
            transformOrigin: "10% 60%", // Tâm xoay
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
            scale: 1.05,
            rotate: 0, // Khi hover thì xoay thẳng lại
            y: 30, // Nhấc lên thêm một chút khi hover
            transition: { duration: 0.3 }
        }}
      >
        {/* Ảnh bìa */}
        <div className="h-[75%] w-full overflow-hidden relative">
          <motion.img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
           <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
            {count}
          </div>
        </div>

        {/* Thông tin */}
        <div className="flex-1 flex flex-col justify-center px-6 bg-white">
             <h3 className="text-2xl font-bold text-gray-800 line-clamp-1">{title}</h3>
             <p className="text-gray-500 text-sm mt-1">Album Collection</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumCard;