import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      <div className="bg-glow-left"></div>
      <div className="bg-glow-right"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl shadow-lg overflow-hidden glow-card">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8 flex flex-col justify-center slide-in-right">
                <h2 className="text-3xl font-heading font-bold mb-4 text-white glow-text">About TJ</h2>
                <p className="text-gray-300 mb-4">
                  With over 5 years of experience in the replica market, TJ has built a reputation for connecting 
                  customers with the highest quality products at unbeatable prices.
                </p>
                <p className="text-gray-300 mb-6">
                  "My mission is to make premium fashion accessible to everyone. I personally 
                  inspect and verify the quality of each product that I showcase, ensuring that my 
                  customers get the best experience possible."
                </p>
                <div className="flex items-center mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 ml-2">4.9/5 - Based on 500+ reviews</span>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="default" className="glow-button">
                    Contact Me
                  </Button>
                </div>
              </div>
              
              <div className="md:h-auto relative overflow-hidden slide-in-left bg-gradient-to-b from-black to-primary/20">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="flex items-center justify-center h-full p-8">
                  {/* Placeholder for client's image - you can replace this with an actual image */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-primary/30 to-primary/70 flex items-center justify-center shadow-xl relative glow">
                    <div className="absolute inset-1 rounded-full bg-black/90"></div>
                    <div className="z-10 text-4xl font-bold text-primary glow-text">TJ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}