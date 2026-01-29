
import "@/styles/globals.css";
import Header from "@/components/public/layouts/Header";
import BackToTopButton from "@/components/common/BackToTopButton";
import SocialSidebar from "@/components/public/SocialSidebar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Header/>
      <SocialSidebar />
      {children}
      <BackToTopButton/>
    </section>
  
  );
}
