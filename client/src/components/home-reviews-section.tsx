// Added: Reviews feature
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { reviews } from "@/data/reviews";
import ScrollAnimation from "@/components/ui/scroll-animation";

export default function HomeReviewsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-black relative overflow-hidden -mb-8">
      {/* Glow effects - poziționare jos pentru alternare - extinse pentru continuitate */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/25 filter blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/30 filter blur-3xl"></div>
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-80 h-80 rounded-full bg-primary/20 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation direction="up" delay={0.1} duration={0.6}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 glow-text">
              What Our Users Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real feedback from our early adopters.
            </p>
          </div>
        </ScrollAnimation>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="User reviews"
        >
          {reviews.map((review, index) => (
            <ScrollAnimation 
              key={review.id} 
              direction="up" 
              delay={0.2 + (index * 0.1)} 
              duration={0.6}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      {review.avatar ? (
                        <img 
                          src={review.avatar} 
                          alt={`${review.name} avatar`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-semibold text-white">{review.name}</h4>
                      {review.role && (
                        <p className="text-sm text-gray-400">{review.role}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <blockquote className="text-gray-300 italic">
                    "{review.content}"
                  </blockquote>

                  {review.date && (
                    <div className="mt-4 text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}