

import HeroSection from "@/components/public/sections/HeroSection";
import AlbumSection from "@/components/public/sections/AlbumSection";
import ServicesSection from "@/components/public/sections/ServiceSection";
import BlogSection from "@/components/public/sections/BlogSection";
import ContactSection from "@/components/public/sections/ContactSection";
import PhotoSection from "@/components/public/sections/PhotoSection";
import ImageRevealSlider from "@/components/public/ImageRevealSlider";
import CoverFlowCarousel from "@/components/public/CoverFlowCarousel";

import { getAlbums } from "@/lib/album";
import { getPhotos } from "@/lib/photo";
import { getServices } from "@/lib/service";

export default async function Home() {
  
  const [albumRes, photoRes, serviceRes] = await Promise.all([
    getAlbums({ page: 1, limit: 6, filters: {} }),
    getPhotos({ page: 1, limit: 10, filters: {} }),
    getServices({ page: 1, limit: 10, filters: {} }),
  ]);

  return (
    <>
      <HeroSection />

      <AlbumSection data={albumRes.data} />

      <CoverFlowCarousel data={photoRes.data} />
      <PhotoSection data={photoRes.data} />

      <ImageRevealSlider />

      <ServicesSection data={serviceRes.data} />

      <BlogSection />
      <ContactSection />
    </>
  );
}
