import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { IntroAbout } from "@/components/IntroAbout";
import { ExploreTreatments } from "@/components/ExploreTreatments";
import { TourOffice } from "@/components/TourOffice";
import { Accreditations } from "@/components/Accreditations";
import { SmileGallery } from "@/components/SmileGallery";
import { StarSmiles } from "@/components/StarSmiles";
import { Testimonials } from "@/components/Testimonials";
import { PressFeatures } from "@/components/PressFeatures";
import { ReviewsStrips } from "@/components/ReviewsStrips";
import { BrandMarquee } from "@/components/BrandMarquee";
import { BlogStrip } from "@/components/BlogStrip";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCta } from "@/components/StickyCta";
import { KineticMarquee } from "@/components/fx/KineticMarquee";
import { JsonLd } from "@/components/JsonLd";
import { reviewsJsonLd } from "@/lib/reviews";
import { getT } from "@/lib/server-i18n";

export default async function Home() {
  const t = await getT();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar />
      <main>
        <Hero />
        <IntroAbout />
        <KineticMarquee
          goldIndex={2}
          words={[
            t("treat.implants"),
            t("treat.crowns"),
            t("treat.veneers"),
            t("treat.prostheses"),
            t("treat.orthodontics"),
          ]}
        />
        <ExploreTreatments />
        <TourOffice />
        <Accreditations />
        <SmileGallery />
        <StarSmiles />
        <ReviewsStrips />
        <Testimonials />
        <PressFeatures />
        <BrandMarquee heading={t("brand.heading")} />
        <BlogStrip />
      </main>
      <SiteFooter />
      <StickyCta />
      <JsonLd data={reviewsJsonLd()} />
    </div>
  );
}