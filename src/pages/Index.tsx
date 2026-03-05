import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import NewsSection from "@/components/NewsSection";
import ImpactSection from "@/components/ImpactSection";
import BoardSection from "@/components/BoardSection";
import DocumentsSection from "@/components/DocumentsSection";
import DonationSection from "@/components/DonationSection";
import JoinSection from "@/components/JoinSection";
import GallerySection from "@/components/GallerySection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <AnnouncementsSection />
        <NewsSection />
        <ImpactSection />
        <BoardSection />
        <DocumentsSection />
        <DonationSection />
        <JoinSection />
        <GallerySection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
