// Added: Documentation preview section
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Users, ArrowRight } from "lucide-react";
import ScrollAnimation from "@/components/ui/scroll-animation";

interface DocPreview {
  title: string;
  description: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  readTime: string;
  tags: string[];
}

export default function DocsPreviewSection() {
  const docPreviews: DocPreview[] = [
    {
      title: "Getting Started with ONLYFINDS",
      description: "Complete guide to navigating ONLYFINDS and making your first purchase through our trusted partners.",
      slug: "getting-started",
      icon: BookOpen,
      readTime: "5 min read",
      tags: ["getting-started", "guide", "basics"]
    },
    {
      title: "Optimizing Your Shopping Experience",
      description: "Learn how to maximize your savings and streamline your shopping process on ONLYFINDS and partner platforms.",
      slug: "optimizing-your-profile", 
      icon: FileText,
      readTime: "8 min read",
      tags: ["optimization", "savings", "tips"]
    },
    {
      title: "Community Guidelines",
      description: "Essential guidelines for being a responsible member of the ONLYFINDS community and replica shopping ecosystem.",
      slug: "community-guidelines",
      icon: Users,
      readTime: "6 min read",
      tags: ["community", "guidelines", "ethics"]
    }
  ];

  return (
    <section className="py-16 bg-black relative overflow-hidden mt-[97px] mb-[97px]">
      {/* Glow effects - poziționare sus pentru alternare - extinse pentru continuitate */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/30 filter blur-3xl"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/25 filter blur-3xl"></div>
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-80 h-80 rounded-full bg-primary/20 filter blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation direction="up" delay={0.1} duration={0.6}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 glow-text">
              Knowledge Base
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to know about shopping smart and getting the most out of ONLYFINDS.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {docPreviews.map((doc, index) => {
            const IconComponent = doc.icon;
            return (
              <ScrollAnimation 
                key={doc.slug} 
                direction="up" 
                delay={0.2 + (index * 0.1)} 
                duration={0.6}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all h-full group">
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-grow">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {doc.readTime}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg leading-snug group-hover:text-primary/90 transition-colors">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {doc.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link href={`/docs/${doc.slug}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-gray-700 text-gray-300 hover:border-primary/50 hover:text-primary/90 hover:bg-primary/5 transition-all group/btn"
                      >
                        Read Guide
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            );
          })}
        </div>

        <ScrollAnimation direction="up" delay={0.5} duration={0.6}>
          <div className="text-center">
            <Link href="/docs">
              <Button 
                className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 hover:border-primary transition-all px-8 py-3 rounded-full font-heading"
              >
                Browse All Documentation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}