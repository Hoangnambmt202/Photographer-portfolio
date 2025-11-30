'use client'

import HeroSection from "@/components/public/sections/HeroSection";
import AlbumSection from "@/components/public/sections/AlbumSection";
import ServicesSection from "@/components/public/sections/ServiceSection";
import BlogSection from "@/components/public/sections/BlogSection";
import ContactSection from "@/components/public/sections/ContactSection";
import PhotoSection from "@/components/public/sections/PhotoSection";
import ImageRevealSlider from "@/components/public/ImageRevealSlider";
import CoverFlowCarousel from "@/components/public/CoverFlowCarousel";


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Portfolio Section - Creative Grid */}
      <AlbumSection />

      <CoverFlowCarousel />
      <PhotoSection />

      <ImageRevealSlider />

      {/* Services Section */}
      <ServicesSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
