import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Clock, Tags, Calendar } from "lucide-react";
import ScrollAnimation from "@/components/ui/scroll-animation";

interface DocMetadata {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
}

interface DocContent {
  metadata: DocMetadata;
  content: string;
}

export default function DocDetailPage() {
  const [, params] = useRoute("/docs/:slug");
  const [docContent, setDocContent] = useState<DocContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      loadDocument(params.slug);
    }
  }, [params?.slug]);

  const loadDocument = async (slug: string) => {
    try {
      setLoading(true);
      
      // Simulate loading markdown content - in a real app, this would fetch from an API
      const docMap: { [key: string]: DocContent } = {
        "getting-started": {
          metadata: {
            title: "Getting Started with ONLYFINDS",
            slug: "getting-started",
            date: "2025-01-20",
            description: "Complete guide to navigating ONLYFINDS and making your first purchase through our trusted partners.",
            tags: ["getting-started", "guide", "basics"],
            draft: false
          },
          content: `# Getting Started with ONLYFINDS

Welcome to ONLYFINDS, your premier destination for discovering quality replica products at competitive prices.

## What is ONLYFINDS?

ONLYFINDS is a curated showcase platform that connects discerning shoppers with trusted replica product sellers.

Register now: [https://cnfans.com/register/?ref=571435](https://cnfans.com/register/?ref=571435)`
        },
        "cnfans-129-coupon-guide": {
          metadata: {
            title: "CNFANS $129 Coupon: How to Redeem Your Welcome Bonus 2025",
            slug: "cnfans-129-coupon-guide",
            date: "2025-02-03",
            description: "Step-by-step guide to claiming your CNFANS $129 shipping coupon.",
            tags: ["cnfans-coupon", "129-coupon", "welcome-bonus", "shipping-discount"],
            draft: false
          },
          content: `# CNFANS $129 Coupon: How to Redeem Your Welcome Bonus 2025

The CNFANS $129 coupon is one of the best shipping discounts available for new users in 2025.

Register for your CNFANS $129 shipping coupon here: https://cnfans.com/register/?ref=571435

## What is the CNFANS $129 Coupon?

The CNFANS $129 coupon is a new user welcome bonus that provides significant shipping discounts for first-time customers.`
        },
        "cnfans-seasonal-coupons-2025": {
          metadata: {
            title: "CNFANS Seasonal Coupons 2025: Black Friday, 11.11, 12.12 Deals",
            slug: "cnfans-seasonal-coupons-2025", 
            date: "2025-02-03",
            description: "Complete calendar of CNFANS seasonal shipping coupons and promo codes.",
            tags: ["seasonal-coupons", "black-friday", "1111-coupon", "1212-coupon"],
            draft: false
          },
          content: `# CNFANS Seasonal Coupons 2025: Black Friday, 11.11, 12.12 Deals

Stay ahead of the biggest shipping discounts with our complete guide to CNFANS seasonal coupons throughout 2025.

Start with the current welcome offer: https://cnfans.com/register/?ref=571435`
        },
        "best-cnfans-spreadsheets-2025": {
          metadata: {
            title: "Best CNFANS Spreadsheets 2025: Updated Links & Categories",
            slug: "best-cnfans-spreadsheets-2025",
            date: "2025-02-03", 
            description: "Access the latest CNFANS spreadsheets with verified links, categories, and coupon codes.",
            tags: ["cnfans-spreadsheet", "verified-links", "categories", "templates"],
            draft: false
          },
          content: `# Best CNFANS Spreadsheets 2025: Updated Links & Categories

Get access to the most comprehensive CNFANS spreadsheet collection with verified links, organized categories, and embedded coupon codes.

Register for the CNFANS $129 coupon: https://cnfans.com/register/?ref=571435`
        },
        "cnfans-coupon-troubleshooting": {
          metadata: {
            title: "CNFANS Coupon Not Working? Troubleshooting Guide 2025",
            slug: "cnfans-coupon-troubleshooting",
            date: "2025-02-03",
            description: "Fix common CNFANS coupon problems. Learn why promo codes fail, eligibility requirements, minimum spend rules, and alternative discount strategies.",
            tags: ["coupon-troubleshooting", "promo-code-issues", "eligibility", "discount-fixes"],
            draft: false
          },
          content: `# CNFANS Coupon Not Working? Troubleshooting Guide 2025

Frustrated with CNFANS coupon code issues? This comprehensive troubleshooting guide covers the most common reasons why CNFANS coupons fail.

Start fresh with a new account for the CNFANS $129 coupon: https://cnfans.com/register/?ref=571435`
        }
      };

      const doc = docMap[slug];
      if (doc) {
        setDocContent(doc);
      } else {
        setError("Document not found");
      }
    } catch (err) {
      setError("Error loading document");
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (content: string) => {
    // Simple markdown formatting for demonstration
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-heading font-bold text-white mb-6 glow-text">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-heading font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold text-white mb-2 mt-4">$1</h4>')
      .replace(/^\- (.*$)/gm, '<li class="text-gray-300 mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="text-gray-300 mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(/^([^<].*)$/gm, '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>');
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400">Loading documentation...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link href="/docs">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!docContent) {
    return (
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-400 mb-4">Document Not Found</h1>
            <p className="text-gray-400 mb-8">The requested documentation page could not be found.</p>
            <Link href="/docs">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{docContent.metadata.title} | ONLYFINDS</title>
        <meta name="description" content={docContent.metadata.description} />
        <meta name="keywords" content={docContent.metadata.tags.join(", ")} />
      </Helmet>

      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollAnimation>
            <div className="mb-8">
              <Link href="/docs">
                <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Documentation
                </Button>
              </Link>

              <div className="mb-6">
                <h1 className="text-4xl font-heading font-bold text-white mb-4 glow-text">
                  {docContent.metadata.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(docContent.metadata.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {Math.ceil(docContent.content.length / 1000)} min read
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {docContent.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      <Tags className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {docContent.metadata.description}
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(docContent.content) }}
                />
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of satisfied customers who save money on shipping with CNFANS.
              </p>
              <a
                href="https://cnfans.com/register/?ref=571435"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3">
                  Get $129 Coupons
                </Button>
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </main>
    </>
  );
}