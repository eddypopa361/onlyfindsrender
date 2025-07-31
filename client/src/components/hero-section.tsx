import { Button } from "@/components/ui/button";
import { MoveRight, ArrowDownCircle } from "lucide-react";
import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';

// Lazy load Spline pentru o încărcare inițială mai rapidă
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function HeroSection() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [showSpline, setShowSpline] = useState(false);

  // Încărcăm Spline doar după ce pagina s-a încărcat complet
  useEffect(() => {
    // Amânăm încărcarea Spline pentru a prioritiza restul componentelor
    const timer = setTimeout(() => {
      setShowSpline(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-black text-white py-20 md:py-28 lg:py-32 w-full min-h-[80vh] rounded-b-3xl">
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Purple glow effects - optimizate */}
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-primary/30 filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary/30 filter blur-3xl"></div>
      
      {/* Spline 3D Background - încărcat lazy și condițional */}
      {showSpline && (
        <div className="absolute inset-0 z-0 scale-125 origin-center overflow-hidden">
          <Suspense fallback={<div className="w-full h-full bg-black"></div>}>
            <Spline
              scene="https://prod.spline.design/4xFLTzyM1pFClIqD/scene.splinecode" 
              className="scale-120"
              onLoad={() => setIsSplineLoaded(true)}
            />
          </Suspense>
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
      
      {/* Animated Particles - reduse ca număr pentru performanță mai bună */}
      <div className="absolute inset-0 overflow-hidden z-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary rounded-full opacity-20 pulse-slow"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/30 inline-block px-4 py-2 rounded-full mb-5 backdrop-blur-sm"
          >
            <span className="text-white font-medium tracking-wide">GET 50% OFF SHIPPING WITH CNFANS</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-6"
          >
            <img 
              src="/images/onlyfinds.png" 
              alt="ONLYFINDS" 
              loading="eager"
              className="h-32 md:h-44 lg:h-56 mx-auto object-contain glow-logo" 
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl font-heading mb-8 max-w-2xl mx-auto"
          >
            Exclusive designer pieces at unbeatable prices. Quality guaranteed.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link 
              href="/products" 
              className="px-8 py-3 bg-primary text-white font-heading font-medium rounded-full glow-button transition-all hover:bg-primary/80 text-lg flex items-center justify-center gap-2 group"
            >
              EXPLORE PRODUCTS
              <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="http://cnfans.com/register/?ref=300004734" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-700 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
              <button className="relative px-8 py-3 bg-white text-primary hover:bg-gray-100 rounded-full font-bold tracking-wider transition-all duration-300 text-lg border border-primary/30">
                GET 50% OFF SHIPPING
              </button>
            </a>
          </motion.div>
          
          <motion.a 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            href="#carousel" 
            className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <span className="mb-2 text-sm">Scroll Down</span>
            <ArrowDownCircle className="w-6 h-6 animate-bounce" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
