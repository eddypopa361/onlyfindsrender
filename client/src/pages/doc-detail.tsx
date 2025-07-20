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
          content: `
# Getting Started with ONLYFINDS

Welcome to ONLYFINDS, your premier destination for discovering quality replica products at competitive prices. This comprehensive guide will walk you through everything you need to know to get started.

## What is ONLYFINDS?

ONLYFINDS is a curated showcase platform that connects discerning shoppers with trusted replica product sellers. We don't sell products directly—instead, we provide carefully selected links to verified sellers on platforms like CNFANS, ensuring you have access to quality products at fair prices.

## How to Navigate Our Platform

### 1. Browse Our Catalog
- **Home Page**: Start with our featured products and trending items
- **Products**: Access our complete catalog with advanced filtering
- **Categories**: Filter by Shoes, Clothing, and Accessories
- **Search**: Use the search function to find specific brands or items

### 2. Product Information
Each product listing includes:
- High-quality product images
- Detailed descriptions
- Pricing information
- Direct links to seller pages
- Brand and category information

## Making Your First Purchase

### Step 1: Find Your Product
Browse our catalog or use search filters to find the items you want.

### Step 2: Review Product Details
Click "View Details" to see comprehensive product information and seller details.

### Step 3: Visit Seller Page
Click "Buy Now" to be redirected to the seller's official page where you can complete your purchase.

### Step 4: Complete Purchase
Follow the seller's checkout process. We recommend using our CNFANS referral link for additional shipping discounts.

## Getting the Best Deals

- **Use Our Referral Links**: Get 50% off shipping when signing up through our CNFANS links
- **Follow Size Guides**: Check seller size charts carefully
- **Read Seller Reviews**: Always check seller ratings and reviews before purchasing
- **Bundle Orders**: Combine multiple items to save on shipping costs

## Need Help?

If you have questions about products or need assistance navigating the platform, check our FAQ section or contact our support team at onlyfinds@gmail.com.

Remember: ONLYFINDS is a showcase platform. All purchases are completed directly with our partner sellers, and their terms and policies apply to your transactions.
          `
        },
        "optimizing-your-profile": {
          metadata: {
            title: "Optimizing Your Shopping Experience",
            slug: "optimizing-your-profile",
            date: "2025-01-18",
            description: "Learn how to maximize your savings and streamline your shopping process on ONLYFINDS and partner platforms.",
            tags: ["optimization", "savings", "tips", "cnfans"],
            draft: false
          },
          content: `
# Optimizing Your Shopping Experience

Maximize your savings and streamline your replica shopping journey with these proven strategies and tips.

## Setting Up Your CNFANS Account

### Using Our Referral Benefits
When you sign up for CNFANS through our referral links, you'll receive:
- **50% off shipping** on your first order
- Access to exclusive member pricing
- Priority customer support
- Detailed order tracking

### Account Optimization Tips
1. **Complete Your Profile**: Add accurate shipping information and preferences
2. **Verify Your Account**: Complete email and phone verification for faster processing
3. **Set Currency Preferences**: Choose your preferred currency for easier price comparison
4. **Enable Notifications**: Stay updated on order status and promotional offers

## Smart Shopping Strategies

### 1. Bundle Your Orders
- **Consolidate Shipping**: Order multiple items to one warehouse
- **Weight Optimization**: Balance item count with weight limits
- **Seasonal Planning**: Plan purchases around shipping promotions

### 2. Timing Your Purchases
- **Seller Promotions**: Follow sellers for flash sales and discounts
- **Shipping Deals**: Take advantage of reduced shipping periods
- **New Arrivals**: Get early access to trending products

### 3. Quality Verification
- **Seller Ratings**: Only purchase from highly-rated sellers
- **Photo Reviews**: Look for buyer photos in reviews
- **Return Policies**: Understand each seller's return process

## Advanced Features

### Warehouse Services
CNFANS offers several value-added services:
- **Photo Inspection**: Request detailed photos before shipping
- **Package Consolidation**: Combine multiple orders
- **Extended Storage**: Hold items for up to 180 days
- **Repackaging**: Optimize packaging for shipping costs

### Communication Tips
- **Use Translation Tools**: Most sellers communicate in Chinese
- **Be Specific**: Provide detailed size and color preferences
- **Ask Questions**: Don't hesitate to contact sellers before purchasing
- **Document Issues**: Keep screenshots for any disputes

## Troubleshooting Common Issues

### Size Discrepancies
- Always consult seller-specific size charts
- Consider ordering multiple sizes when possible
- Factor in shrinkage for clothing items
- Ask sellers for measurements when in doubt

### Shipping Delays
- Monitor tracking information regularly
- Account for customs processing time
- Consider seasonal shipping delays
- Keep realistic expectations for international shipping

### Quality Concerns
- Research batch information before ordering
- Read recent reviews for quality updates
- Consider ordering samples for new sellers
- Understand the difference between batches

## Maximizing Your Investment

### Building Relationships
- **Consistent Sellers**: Build relationships with trusted sellers
- **Communication**: Maintain polite, clear communication
- **Feedback**: Leave honest reviews to help the community
- **Referrals**: Share ONLYFINDS with friends for mutual benefits

### Long-term Strategy
- Track your orders and expenses
- Build a wishlist for future purchases
- Stay informed about market trends
- Participate in community discussions

By following these optimization strategies, you'll enhance your shopping experience and maximize the value of every purchase through ONLYFINDS and our partner platforms.
          `
        },
        "community-guidelines": {
          metadata: {
            title: "Community Guidelines and Best Practices",
            slug: "community-guidelines",
            date: "2025-01-16",
            description: "Essential guidelines for being a responsible member of the ONLYFINDS community and replica shopping ecosystem.",
            tags: ["community", "guidelines", "ethics", "responsibility"],
            draft: false
          },
          content: `
# Community Guidelines and Best Practices

Creating a positive, respectful environment for all ONLYFINDS users requires adherence to our community guidelines and ethical shopping practices.

## Our Community Values

### Transparency
- **Honest Reviews**: Share authentic experiences with products and sellers
- **Accurate Information**: Provide truthful details when asking questions or giving advice
- **Clear Communication**: Be specific about issues, concerns, or recommendations

### Respect
- **Seller Relations**: Treat all sellers with courtesy and professionalism
- **Community Members**: Respect diverse opinions and experiences
- **Platform Rules**: Follow ONLYFINDS and partner platform guidelines

### Responsibility
- **Legal Compliance**: Understand and comply with local laws regarding replica products
- **Informed Purchasing**: Research products and sellers before making purchases
- **Ethical Practices**: Support sellers who demonstrate quality and reliability

## Responsible Shopping Practices

### Understanding Replica Products
**Legal Considerations:**
- Research local laws regarding replica product imports
- Understand the difference between inspired designs and counterfeits
- Be aware of customs regulations in your country
- Never attempt to resell replicas as authentic items

**Quality Expectations:**
- Understand that replicas vary in quality and accuracy
- Set realistic expectations based on price points
- Research batch information and recent reviews
- Consider replicas as inspired alternatives, not exact copies

### Seller Interaction Best Practices

#### Before Purchasing
- Read seller descriptions and policies carefully
- Ask specific questions about sizing, materials, or defects
- Request additional photos if needed
- Verify shipping options and timeframes

#### During Transactions
- Follow seller payment instructions exactly
- Keep records of all communications
- Be patient with response times (consider time zones)
- Respect seller policies and procedures

#### After Purchase
- Leave honest, constructive feedback
- Contact sellers directly for any issues before escalating
- Share experiences to help other community members
- Report any fraudulent or unethical behavior

## Community Participation

### Sharing Information
**Helpful Contributions:**
- Product reviews with photos and detailed experiences
- Seller recommendations based on personal experience
- Sizing information and fit guidance
- Shipping and customs insights

**Avoid Sharing:**
- Personal information (addresses, payment details)
- Seller private communication without permission
- Unfounded accusations or rumors
- Misleading price or quality claims

### Reporting Issues
If you encounter problems, follow this process:
1. **Contact the Seller**: Address issues directly first
2. **Document Everything**: Keep screenshots and records
3. **Escalate When Necessary**: Contact platform support if needed
4. **Share Constructively**: Warn others about legitimate concerns

## Platform-Specific Guidelines

### CNFANS Partnership
As a CNFANS partner platform, we maintain specific guidelines:
- Use our referral links to support the platform
- Follow CNFANS terms of service
- Respect their warehouse and shipping policies
- Report any issues through proper channels

### ONLYFINDS Platform
**Permitted Activities:**
- Browsing and sharing product links
- Discussing experiences and recommendations
- Asking questions about products or processes
- Sharing helpful tips and guides

**Prohibited Activities:**
- Attempting to sell products through our platform
- Sharing inappropriate or offensive content
- Harassing other users or sellers
- Violating any applicable laws or regulations

## Building a Positive Community

### For New Members
- Start with small orders to understand the process
- Ask questions—experienced members are here to help
- Read documentation and guides before purchasing
- Be patient while learning platform navigation

### For Experienced Members
- Share knowledge generously with newcomers
- Provide constructive feedback and guidance
- Report issues responsibly and factually
- Help maintain a welcoming environment

### Communication Standards
- Use clear, respectful language
- Provide context when asking questions
- Search existing discussions before posting duplicates
- Stay on-topic in discussions and forums

## Ethical Considerations

### Personal Responsibility
- Make informed decisions about replica purchases
- Understand the implications of your purchasing choices
- Respect intellectual property while making personal choices
- Consider the impact of your actions on the community

### Supporting Quality
- Choose sellers who demonstrate good practices
- Reward honest, reliable service with repeat business
- Share positive experiences to help quality sellers grow
- Avoid supporting sellers who engage in deceptive practices

## Enforcement and Consequences

ONLYFINDS reserves the right to:
- Remove content that violates community guidelines
- Restrict access for users who repeatedly violate policies
- Report illegal activities to appropriate authorities
- Update guidelines as needed to maintain community standards

By participating in the ONLYFINDS community, you agree to uphold these guidelines and contribute to a positive, respectful environment for all users.
          `
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

  if (error || !docContent) {
    return (
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-3xl font-heading font-bold text-white mb-4">Document Not Found</h1>
            <p className="text-gray-400 mb-6">The requested documentation could not be found.</p>
            <Link href="/docs">
              <Button className="bg-primary hover:bg-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
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
        <title>{docContent.metadata.title} - ONLYFINDS Documentation</title>
        <meta name="description" content={docContent.metadata.description} />
      </Helmet>
      
      <main className="pt-24 pb-16 bg-black text-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Navigation */}
          <ScrollAnimation direction="up" delay={0.1}>
            <div className="mb-8">
              <Link href="/docs">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:border-primary/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          {/* Document Header */}
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 glow-text">
                {docContent.metadata.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(docContent.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.ceil(docContent.content.split(' ').length / 200)} min read
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Tags className="w-4 h-4 text-gray-500 mt-1" />
                {docContent.metadata.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-400 text-lg leading-relaxed">
                {docContent.metadata.description}
              </p>
            </div>
          </ScrollAnimation>

          {/* Document Content */}
          <ScrollAnimation direction="up" delay={0.3}>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(docContent.content) }}
                />
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Navigation Footer */}
          <ScrollAnimation direction="up" delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
              <Link href="/docs">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-primary/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Documentation
                </Button>
              </Link>
              <Link href="/howto">
                <Button className="bg-primary hover:bg-primary/80">
                  How to Order Guide
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </main>
    </>
  );
}