import { Button } from "@/components/ui/button";
import { MoveRight, ArrowDownCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { CNFANS_REGISTER } from "@/lib/constants";

// Import optimized Spline component
import OptimizedSpline from '@/components/ui/optimized-spline';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-20 md:py-28 lg:py-32 w-full min-h-[80vh] rounded-b-3xl">
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Purple glow effects - optimizate */}
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-primary/30 filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary/30 filter blur-3xl"></div>
      
      {/* Optimized Spline 3D Background */}
      <div className="absolute inset-0 z-0 scale-125 origin-center overflow-hidden">
        <OptimizedSpline
          scene="https://prod.spline.design/4xFLTzyM1pFClIqD/scene.splinecode" 
          className="scale-120"
          priority="high"
        />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
      
      {/* Particles optimizate - mai puține pentru performanță */}
      <div className="absolute inset-0 overflow-hidden z-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary rounded-full opacity-10 animate-pulse"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              top: `${20 + i * 30}%`,
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: '6s',
            }}
          />
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
            <span className="text-white font-medium tracking-wide">GET $129 COUPONS WITH CNFANS</span>
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
              href={CNFANS_REGISTER} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative inline-block group"
            >
              
              <button className="relative px-8 py-3 bg-white text-primary hover:bg-gray-100 rounded-full font-bold tracking-wider transition-all duration-300 text-lg border border-primary/30">
                GET $129 COUPONS
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
