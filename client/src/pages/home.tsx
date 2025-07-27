import { lazy, Suspense } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import ScrollAnimation from "@/components/ui/scroll-animation";

// Încărcăm componentele lazy pentru a îmbunătăți performanța inițială
const HeroSection = lazy(() => import("@/components/hero-section"));
const ProductCarousel = lazy(() => import("@/components/product-carousel"));
const BestSellersSection = lazy(() => import("@/components/best-sellers-section"));

const PromoSection = lazy(() => import("@/components/promo-section"));
const HomeReviewsSection = lazy(() => import("@/components/home-reviews-section"));
const DocsPreviewSection = lazy(() => import("@/components/docs-preview-section"));

// Componenta pentru loading state
const SectionLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex flex-col items-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
      <p className="text-gray-400">Loading section...</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <Helmet>
        <title>ONLYFINDS - Designer Products Showcase</title>
        <meta 
          name="description" 
          content="Explore premium replicas at affordable prices. Find the latest designer shoes, clothing, and accessories." 
        />
        {/* Preconectare la domain-uri externe pentru încărcare mai rapidă */}
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="preconnect" href="http://cnfans.com" />
      </Helmet>
      
      <main className="bg-black">
        {/* Hero Section - prima componentă se încarcă imediat */}
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
        
        {/* Carousel Section */}
        <div className="about-section-wrapper">
          <section id="carousel" className="section-connector py-12 relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <div className="bg-glow-left"></div>
            <div className="bg-glow-right"></div>
            <div className="relative z-10">
              <Suspense fallback={<SectionLoader />}>
                <ScrollAnimation direction="up" delay={0.2} duration={0.6}>
                  <ProductCarousel />
                </ScrollAnimation>
              </Suspense>
            </div>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Referral Link Section - păstrăm această secțiune simplă inline, fără lazy loading */}
        <div className="referral-section-wrapper">
          <section className="py-8 relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <ScrollAnimation direction="up" delay={0.1} duration={0.5}>
                <div className="relative overflow-hidden">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-900 rounded-xl blur-xl opacity-50"></div>
                  <div className="relative overflow-hidden rounded-lg border border-primary/30 shadow-2xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 backdrop-blur-sm bg-primary/10 z-10"></div>
                      <img 
                        src="https://i.imgur.com/VgG5xvr.jpg" 
                        alt="CNFANS shipping discount" 
                        className="w-full h-full object-cover opacity-100"
                        style={{ filter: 'blur(1px)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/40 z-20"></div>
                    </div>
                    
                    {/* Content overlay */}
                    <div className="relative z-30 flex flex-col items-center text-center p-8 md:p-12">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white glow-text">
                        Get 50% Off Shipping
                      </h2>
                      <p className="text-gray-100 max-w-3xl mb-8 md:text-3xl font-bold text-shadow-lg">
                        Use our special sign up link when joining CNFANS to receive 50% off shipping on your first haul!
                      </p>

                      <a 
                        href="http://cnfans.com/register/?ref=300004734" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative inline-block group"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-700 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                        <button className="relative px-8 py-4 bg-primary hover:bg-primary/80 text-white font-heading font-medium rounded-full transition-all shadow-lg hover:shadow-primary/30 text-lg">
                          JOIN CNFANS NOW
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Best Sellers Section */}
        <div className="about-section-wrapper">
          <section id="bestsellers" className="section-connector relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <div className="bg-glow-left"></div>
            <div className="bg-glow-right"></div>
            <div className="relative z-10">
              <Suspense fallback={<SectionLoader />}>
                <ScrollAnimation direction="up" delay={0.2}>
                  <BestSellersSection />
                </ScrollAnimation>
              </Suspense>
            </div>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Browse All Products Section */}
        <div className="about-section-wrapper">
          <section className="section-connector py-16 relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <div className="bg-glow-left"></div>
            <div className="bg-glow-right"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <ScrollAnimation direction="up" delay={0.1} variant="fade">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 inline-block relative text-white">
                  <span className="relative z-10">Browse Our Collections</span>
                  <div className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></div>
                </h2>
                <p className="text-gray-300 max-w-xl mx-auto mb-8">
                  Discover our vast selection of premium quality products for every style
                </p>
                <ScrollAnimation direction="up" delay={0.3} duration={0.6}>
                  <Link href="/products">
                    <Button className="bg-primary text-white hover:bg-primary/80 rounded-full px-8 py-6 text-lg font-heading font-bold shadow-lg glow-button transition-all duration-300">
                      EXPLORE ALL PRODUCTS
                    </Button>
                  </Link>
                </ScrollAnimation>
              </ScrollAnimation>
            </div>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Reviews Section */}
        <div className="reviews-section-wrapper">
          <section className="section-connector relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <Suspense fallback={<SectionLoader />}>
              <ScrollAnimation direction="up" delay={0.2} duration={0.7}>
                <HomeReviewsSection />
              </ScrollAnimation>
            </Suspense>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Documentation Preview Section */}
        <div className="docs-section-wrapper">
          <section className="section-connector relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <Suspense fallback={<SectionLoader />}>
              <ScrollAnimation direction="up" delay={0.2} duration={0.7}>
                <DocsPreviewSection />
              </ScrollAnimation>
            </Suspense>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
        
        {/* Promo Section */}
        <div className="promo-section-wrapper">
          <section className="section-connector relative">
            {/* Overlay pentru tranziție netedă la început */}
            <div className="section-transition-overlay section-transition-overlay-top"></div>
            
            <Suspense fallback={<SectionLoader />}>
              <ScrollAnimation direction="up" delay={0.2} duration={0.7}>
                <PromoSection />
              </ScrollAnimation>
            </Suspense>
            
            {/* Overlay pentru tranziție netedă la sfârșit */}
            <div className="section-transition-overlay section-transition-overlay-bottom"></div>
          </section>
        </div>
      </main>
    </>
  );
}
