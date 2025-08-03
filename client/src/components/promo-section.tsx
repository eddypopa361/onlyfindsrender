import { Button } from "@/components/ui/button";
import { MailIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import { CNFANS_REGISTER } from "@/lib/constants";

export default function PromoSection() {
  return (
    <section id="community" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      <div className="bg-glow-left"></div>
      <div className="bg-glow-right"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl shadow-lg p-4 md:p-8 glow-card">
            <div className="text-center mb-4 md:mb-8">
              <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4 relative inline-block text-white glow-text">
                <span className="relative z-10">Join Our Community</span>
                <div className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></div>
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Stay up to date with our newest products, exclusive discounts, and community events
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://discord.gg/4jzdSZGD" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 md:p-6 bg-black/70 border border-primary/30 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all text-center group glow-card"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                  <MessageCircleIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1 text-white">Discord</h3>
                <p className="text-sm text-gray-400">Join our active community</p>
              </a>
              
              <div 
                className="flex flex-col items-center justify-center p-3 md:p-6 bg-black/70 border border-primary/30 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all text-center group glow-card"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-all">
                  <MailIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-1 text-white">Contact Us</h3>
                <p className="text-sm text-gray-400">onlyfinds@gmail.com</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <a 
                href={CNFANS_REGISTER} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary/20 px-4 md:px-6 py-2 md:py-3 rounded-full mb-5 glow-button hover:bg-primary/30 transition-all"
              >
                <span className="text-white font-medium text-sm md:text-lg">CLICK HERE TO GET $129 COUPONS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
