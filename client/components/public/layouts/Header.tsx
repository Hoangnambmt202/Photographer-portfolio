"use client";

import { useState, useEffect } from "react";
import { Menu, X, Camera } from "lucide-react";
import type { MouseEvent } from "react";
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Concept", href: "#albums" },
    { name: "Ảnh", href: "#photos" },
    { name: "Dịch vụ", href: "#services" },
    { name: "Blog", href: "#blog" },
    { name: "Liên hệ", href: "#contact" },
  ];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleClick(e, "#home")}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="relative">
                <Camera
                  className={`transition-all duration-500 ${
                    scrolled ? "w-7 h-7 text-black" : "w-8 h-8 text-white"
                  } group-hover:scale-110`}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className={`font-light tracking-[0.25em] uppercase transition-all duration-500 ${
                  scrolled ? "text-xl text-black" : "text-2xl text-white"
                }`}
              >
                Lens<span className="font-semibold">Art</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`relative px-6 py-2 transition-all duration-500 group ${
                    scrolled
                      ? "text-black/70 hover:text-black"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 text-sm font-light tracking-widest uppercase">
                    {item.name}
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                      scrolled ? "bg-black" : "bg-white"
                    }`}
                  ></div>
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 transition-colors duration-300 ${
                scrolled
                  ? "text-black hover:text-gray-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl ${
            mobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col py-6 px-6 space-y-1">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="px-4 py-3 text-black/70 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-light tracking-widest uppercase"
                style={{
                  animation: mobileMenuOpen
                    ? `slideIn 0.3s ease-out ${index * 50}ms both`
                    : "none",
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
