import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { FileText, BookOpen, Users, ArrowRight, Clock, Tags, DollarSign, Truck, Calendar, Star, Percent, Download } from "lucide-react";
import ScrollAnimation from "@/components/ui/scroll-animation";

interface DocItem {
  title: string;
  description: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  readTime: string;
  tags: string[];
  date: string;
}

export default function DocsPage() {
  const docs: DocItem[] = [
    {
      title: "Getting Started with ONLYFINDS",
      description: "Complete guide to navigating ONLYFINDS and making your first purchase through our trusted partners. Learn the basics of product discovery, account setup, and placing your first order.",
      slug: "getting-started",
      icon: BookOpen,
      readTime: "5 min read",
      tags: ["getting-started", "guide", "basics"],
      date: "2025-01-20"
    },
    {
      title: "Optimizing Your Shopping Experience",
      description: "Learn how to maximize your savings and streamline your shopping process on ONLYFINDS and partner platforms. Discover advanced features, warehouse services, and strategic shopping tips.",
      slug: "optimizing-your-profile", 
      icon: FileText,
      readTime: "8 min read",
      tags: ["optimization", "savings", "tips", "cnfans"],
      date: "2025-01-18"
    },
    {
      title: "Community Guidelines and Best Practices",
      description: "Essential guidelines for being a responsible member of the ONLYFINDS community and replica shopping ecosystem. Understanding ethics, legal considerations, and community standards.",
      slug: "community-guidelines",
      icon: Users,
      readTime: "6 min read",
      tags: ["community", "guidelines", "ethics", "responsibility"],
      date: "2025-01-16"
    },
    {
      title: "Finding Cheap Shipping on CNFANS: 2025 Tips + Promo Codes",
      description: "Complete guide to cutting CNFANS shipping costs with coupons, smart packaging, and order consolidation. Includes practical examples and the latest promo codes for maximum savings.",
      slug: "cheap-cnfans-shipping-2025",
      icon: DollarSign,
      readTime: "12 min read",
      tags: ["shipping", "cnfans", "coupons", "savings", "promo-codes"],
      date: "2025-02-03"
    },
    {
      title: "CNFANS Shipping Tips Every Buyer Should Know",
      description: "Master CNFANS shipping with proven strategies, discount codes, and optimization techniques. Learn consolidation tactics and spreadsheet workflows that keep costs low.",
      slug: "cnfans-shipping-tips",
      icon: Truck,
      readTime: "10 min read",
      tags: ["shipping", "cnfans", "tips", "optimization", "workflow"],
      date: "2025-02-03"
    },
    {
      title: "CNFANS Affiliate Link Guide: How It Works & How to Share",
      description: "Learn how to effectively use and share CNFANS affiliate links. Discover best practices for content creation, high-converting copy, and responsible promotion strategies.",
      slug: "cnfans-affiliate-guide",
      icon: Users,
      readTime: "8 min read",
      tags: ["affiliate", "cnfans", "marketing", "referral", "content"],
      date: "2025-02-03"
    },
    {
      title: "CNFANS $129 Coupon: How to Redeem Your Welcome Bonus 2025",
      description: "Step-by-step guide to claiming your CNFANS $129 shipping coupon. Learn about eligibility, expiration, and how to maximize savings with the welcome bonus.",
      slug: "cnfans-129-coupon-guide",
      icon: DollarSign,
      readTime: "6 min read",
      tags: ["cnfans-coupon", "129-coupon", "welcome-bonus", "shipping-discount"],
      date: "2025-02-03"
    },
    {
      title: "CNFANS Seasonal Coupons 2025: Black Friday, 11.11, 12.12 Deals",
      description: "Complete calendar of CNFANS seasonal shipping coupons and promo codes. Track Black Friday, Singles Day, and holiday discounts throughout 2025.",
      slug: "cnfans-seasonal-coupons-2025",
      icon: Calendar,
      readTime: "9 min read",
      tags: ["seasonal-coupons", "black-friday", "1111-coupon", "1212-coupon"],
      date: "2025-02-03"
    },
    {
      title: "Best CNFANS Spreadsheets 2025: Updated Links & Categories",
      description: "Access the latest CNFANS spreadsheets with verified links, categories, and coupon codes. Download templates for shoes, clothing, accessories, and trending finds.",
      slug: "best-cnfans-spreadsheets-2025",
      icon: Download,
      readTime: "7 min read",
      tags: ["cnfans-spreadsheet", "verified-links", "categories", "templates"],
      date: "2025-02-03"
    },
    {
      title: "CNFANS Coupon Not Working? Troubleshooting Guide 2025",
      description: "Fix common CNFANS coupon problems. Learn why promo codes fail, eligibility requirements, minimum spend rules, and alternative discount strategies.",
      slug: "cnfans-coupon-troubleshooting",
      icon: Star,
      readTime: "5 min read",
      tags: ["coupon-troubleshooting", "promo-code-issues", "eligibility", "discount-fixes"],
      date: "2025-02-03"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Documentation - ONLYFINDS</title>
        <meta name="description" content="Complete guides and documentation for ONLYFINDS platform. Learn how to shop smart and get the most out of our services." />
      </Helmet>
      
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <ScrollAnimation direction="up" delay={0.1} duration={0.6}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 glow-text">
                Documentation & Guides
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to know about shopping smart and getting the most out of ONLYFINDS. From beginner guides to advanced optimization strategies.
              </p>
            </div>
          </ScrollAnimation>

          {/* Quick Navigation */}
          <ScrollAnimation direction="up" delay={0.2} duration={0.6}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Beginner Guides</h3>
                  <p className="text-sm text-gray-400">Start your journey with ONLYFINDS</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Advanced Tips</h3>
                  <p className="text-sm text-gray-400">Optimize your shopping experience</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">Community</h3>
                  <p className="text-sm text-gray-400">Guidelines and best practices</p>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>

          {/* Documentation List */}
          <div className="space-y-6">
            {docs.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <ScrollAnimation 
                  key={doc.slug} 
                  direction="up" 
                  delay={0.3 + (index * 0.1)} 
                  duration={0.6}
                >
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-primary/30 transition-all group">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <CardTitle className="text-white text-xl leading-snug group-hover:text-primary/90 transition-colors mb-2">
                            {doc.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {doc.readTime}
                            </span>
                            <span>
                              {new Date(doc.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-400 leading-relaxed mb-4">
                        {doc.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Tags className="w-4 h-4 text-gray-500 mt-0.5" />
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link href={`/docs/${doc.slug}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-700 text-gray-300 hover:border-primary/50 hover:text-primary/90 hover:bg-primary/5 transition-all group/btn"
                          >
                            Read Guide
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              );
            })}
          </div>

          {/* Call to Action */}
          <ScrollAnimation direction="up" delay={0.7} duration={0.6}>
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-primary/10 to-red-900/10 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">
                    Ready to Start Shopping?
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Now that you know how to use ONLYFINDS effectively, explore our product catalog and start building your collection.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                      <Button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-heading">
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/howto">
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-primary/50 hover:text-primary/90 px-8 py-3 rounded-full">
                        How to Order
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>
        </div>
      </main>
    </>
  );
}