"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

export default function SocialSidebar() {
  const socials = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      href: "https://facebook.com/",
      color: "hover:bg-blue-600",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      href: "https://instagram.com/",
      color: "hover:bg-pink-500",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      href: "https://linkedin.com/",
      color: "hover:bg-sky-700",
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      href: "mailto:yourname@example.com",
      color: "hover:bg-amber-500",
    },
    {
      name: "Call",
      icon: <Phone size={20} />,
      href: "tel:+84123456789",
      color: "hover:bg-green-600",
    },
  ];

  return (
    <div className="fixed top-1/3 left-4 z-50 flex flex-col gap-3">
      {socials.map((item, index) => (
        <motion.a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white shadow-md transition-transform duration-300 ${item.color} hover:scale-110`}
          title={item.name}
        >
          {item.icon}
        </motion.a>
      ))}
    </div>
  );
}
