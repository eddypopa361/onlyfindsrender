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
        },
        "cheap-cnfans-shipping-2025": {
          metadata: {
            title: "Finding Cheap Shipping on CNFANS: 2025 Tips + Promo Codes",
            slug: "cheap-cnfans-shipping-2025",
            date: "2025-02-03",
            description: "Complete guide to cutting CNFANS shipping costs with coupons, smart packaging, and order consolidation. Includes practical examples and the latest promo codes for maximum savings.",
            tags: ["shipping", "cnfans", "coupons", "savings", "promo-codes"],
            draft: false
          },
          content: `
# Finding Cheap Shipping on CNFANS: 2025 Tips + Promo Codes

Looking for cheaper CNFANS shipping this year? This guide shows you the most reliable ways to cut costs with CNFANS shipping coupons, smart packaging, and order consolidation—plus practical examples you can follow today.

> **Quick tip:** New users can register and check for a **$129 CNFANS shipping coupon** here: [https://cnfans.com/register/?ref=571435](https://cnfans.com/register/?ref=571435)

---

## 1) Secure the Biggest Discounts First

**Register and claim welcome offers.** After you create an account, check the **Coupons/Promotions** section in your dashboard. Look for a **$129 shipping coupon** or a seasonal promo tied to your shipping line.

**Watch seasonal windows.** Black Friday, Cyber Monday, Singles' Day (11.11), 12.12, back‑to‑school, and mid‑year sales often include stronger shipping promos. If you can wait a few days, time your parcel for these periods.

**Use referrals when available.** Referral and affiliate campaigns sometimes add extra coupon value for new sign‑ups and first shipments.

---

## 2) Optimize What You Pay For (Weight, Volume, Shipping Line)

**Consolidate orders.** One outbound parcel is usually cheaper than several small ones because you pay handling and linehaul once.

**Lower volumetric weight.** Ask the warehouse to **remove shoe boxes** (if presentation isn't critical) and **flatten apparel**. Reducing length/width/height can drop the charged weight significantly.

**Pick the right line.** Express is fast but expensive. Economy lines are cheaper; **priority economy** balances speed and price. Compare ETA and zones before paying.

**Avoid peak surcharges.** Pre‑holiday rushes often add temporary fees. If your items are not urgent, ship right after the rush.

**Prevent reship with QC.** Approve photo/video **quality checks** before consolidation. Avoiding a return/reship protects your savings.

> **Compliance note:** Always declare items accurately and follow your local customs rules.

---

## 3) How to Use CNFANS Promo Codes Effectively

1. **Check the dashboard first.** Apply the highest‑value **eligible** coupon for your chosen shipping line.
2. **Assume one code per order.** Most coupons don't stack. Weigh a fixed amount (e.g., $129) against a percentage discount to see which wins for your parcel.
3. **Match the rules.** Some codes require minimum weight/value or specific lines. Read the terms to avoid losing eligibility.
4. **Mind the expiry.** If you're still waiting for items to arrive, set a reminder so you can consolidate and ship **before** the code expires.

---

## 4) Example: Separate vs. Consolidated

**Scenario:** 3 apparel items + 1 pair of sneakers.

* **Separate parcels (4 shipments):** pay handling & linehaul four times; the shoebox increases volumetric weight.
* **Consolidated (1 shipment):** a single handling fee; shoebox removed; apparel vacuum‑packed → **lower volume** and **one coupon** applied once. Net savings are typically higher.

> Many buyers see a **20–40%** lower effective per‑item shipping cost with consolidation (varies by line/zone).

---

## 5) Packaging Choices That Lower Cost

* **Remove shoebox** when you don't need retail presentation.
* **Vacuum‑pack apparel** (confirm availability) to reduce thickness.
* **Group small accessories** into one pouch.
* **Don't over‑stuff.** Moving up one size class can erase the discount.

---

## 6) Plan With a Simple Spreadsheet

Track item **weight**, **L/W/H**, **arrival date**, **QC status**, **box removal**, and a **target ship date**. Ship on a coupon day with enough items to hit the best price tier—without pushing volume too high.

---

## FAQ

**Where do I find a current CNFANS promo code?**
Log in and open your **Coupons** panel. Also watch seasonal banners and email offers.

**Can I stack two shipping coupons?**
Usually no. Pick the highest‑value eligible coupon.

**Do coupons work on every shipping line?**
Some are line‑specific or require a minimum weight/value. Read the terms next to the code.

**Is removing the shoebox worth it?**
Often yes—especially for sneakers—because it reduces volumetric weight and total cost.

---

## Final Call to Action

Ready to pay less for shipping? **Register on CNFANS** and look for the best available promo—then consolidate and optimize packaging for maximum savings: [https://cnfans.com/register/?ref=571435](https://cnfans.com/register/?ref=571435)
          `
        },
        "cnfans-shipping-tips": {
          metadata: {
            title: "CNFANS Shipping Tips Every Buyer Should Know",
            slug: "cnfans-shipping-tips",
            date: "2025-02-03",
            description: "Master CNFANS shipping with proven strategies, discount codes, and optimization techniques. Learn consolidation tactics and spreadsheet workflows that keep costs low.",
            tags: ["shipping", "cnfans", "tips", "optimization", "workflow"],
            draft: false
          },
          content: `
# CNFANS Shipping Tips Every Buyer Should Know

Looking for cheap shipping CNFANS options without guesswork? These CNFANS shipping tips show exactly how to use a CNFANS shipping coupon, spot a CNFANS shipping discount, and time CNFANS shipping deals—plus a simple spreadsheet workflow that keeps costs low.

New here? Create your account and look for the CNFANS $129 coupon (new‑user CNFANS register coupon) in your dashboard: https://cnfans.com/register/?ref=571435

## 1) Grab the biggest discount first

Register & claim welcome offers. After sign‑up, check Coupons/Promotions for a CNFANS discount code. If you see the $129 CNFANS coupon, plan your outbound parcel to use it before it expires.

Watch seasonal windows. Black Friday, Cyber Monday, 11.11, and 12.12 usually bring stronger CNFANS shipping deals. If timing allows, consolidate and ship during these events.

Use a CNFANS affiliate link when available. Referral campaigns sometimes unlock extra benefits during registration or first shipment.

Pro tip: Keep a simple note with "best code today," expiry date, and eligible shipping lines so you don't lose the window.

## 2) Reduce what you're charged for (weight & volume)

Consolidate orders into one parcel whenever possible—one handling fee, one linehaul, one coupon application.

Lower volumetric weight. Ask the warehouse to remove shoe boxes (if presentation isn't essential), flatten apparel, and avoid excessive filler. Smaller L × W × H can cut the charged weight.

Pick the right line. Express is quickest but pricey; economy or priority economy can be far cheaper. Compare ETAs and zones before you pay.

Avoid peak surcharges. If time isn't critical, ship right after peak periods to avoid temporary fees.

Always follow local customs rules—penalties or returns cost more than any discount.

## 3) How to use CNFANS coupons (step‑by‑step)

1. Login → Coupons. In your dashboard, open the Coupons/Promotions section.
2. Pick the best code. Compare a fixed amount (e.g., CNFANS $129 coupon) against a percentage code and match the terms (line, minimum weight/value).
3. Apply at checkout. Select your shipping line, enter the CNFANS discount code, and confirm the price drops in the summary.
4. If a code fails, retry. Refresh, switch browser, re‑select the line, or try a different eligible code.

Keywords to remember as you shop: how to use CNFANS coupons, CNFANS shipping coupon, CNFANS shipping discount, CNFANS shipping deals.

## 4) Spreadsheet planning that saves money

Organized buyers pay less. A lightweight spreadsheet helps you decide when to consolidate and what to ship.

Columns to track: product name, seller link, unit price, weight, size (L/W/H), arrival date, QC pass/fail, box removal, target ship date, coupon used.

Use Google Sheets or Excel. Start with Google Sheets product export if your catalog already lives online. If not, build a simple table and keep it updated.

## 5) QC and packing choices that prevent re‑ship

Request QC photos/video before consolidation; catching defects or wrong sizes early avoids expensive reshipments.

Pack smart: vacuum‑pack apparel when available; group small accessories; avoid over‑stuffing that bumps you into the next size class.

## 6) Advanced savings tactics

Time the checkout: Apply the best CNFANS shipping coupon on a day your items are already in the warehouse and ready to consolidate.

Keep a fallback line: If an economy line is full or slow, priority economy may be cheaper overall than reshipping later.

Track everything: A tiny spreadsheet or dashboard beats guessing and helps you learn which CNFANS shipping tips save the most over time.

## FAQ (quick answers)

Q: Where can I find an active CNFANS shipping discount?
A: Log in and open your Coupons panel; look for seasonal banners and email promos. New users can try the CNFANS register coupon via: https://cnfans.com/register/?ref=571435

Q: Can I stack two coupons?
A: Usually no. Choose the highest‑value eligible code for your shipping line.

Q: Does removing shoe boxes really help?
A: Yes—lower volume often means lower charged weight, especially for sneakers.

Q: Is there a single best line for everyone?
A: No. Compare price vs. speed by zone; many buyers prefer priority economy for balance.

## Final call to action

Ready to save? Register, consolidate smart, apply your CNFANS discount code, and ship on the right day. Start here → https://cnfans.com/register/?ref=571435
          `
        },
        "cnfans-affiliate-guide": {
          metadata: {
            title: "CNFANS Affiliate Link Guide: How It Works & How to Share",
            slug: "cnfans-affiliate-guide",
            date: "2025-02-03",
            description: "Learn how to effectively use and share CNFANS affiliate links. Discover best practices for content creation, high-converting copy, and responsible promotion strategies.",
            tags: ["affiliate", "cnfans", "marketing", "referral", "content"],
            draft: false
          },
          content: `
# CNFANS Affiliate Link Guide: How It Works & How to Share

If you want to help others get cheap shipping CNFANS while earning referral credit, this guide explains the CNFANS affiliate link flow, how to share it responsibly, and what copy converts best. We'll also cover how CNFANS shipping coupons (including the $129 CNFANS coupon) and CNFANS discount codes fit into your message.

Quick start: share this registration link so new users can look for the CNFANS register coupon during sign‑up: https://cnfans.com/register/?ref=571435

## How the CNFANS affiliate link works (overview)

1. A user clicks your CNFANS affiliate link.
2. They register and check their dashboard for a CNFANS shipping coupon (e.g., a $129 CNFANS coupon).
3. When they ship, the platform attributes the referral to your link (according to CNFANS rules in your region).

Why it converts: people want CNFANS shipping deals, how to use CNFANS coupons, and clear steps to lower costs. Lead with savings, then show the process.

## Best places to share (without spamming)

Instagram/TikTok bio & pinned comments: Short CTA + link.
YouTube descriptions: Add a "How to save on CNFANS shipping" section with your link.
Discord/Telegram communities: Post a concise guide + FAQs.
Blog/Docs: Publish tutorials that include the link (e.g., "CNFANS Shipping Tips Every Buyer Should Know").

Always disclose that the link is an affiliate/referral link.

## High‑converting copy (paste and adapt)

Short: "New to CNFANS? Register here and check your dashboard for a $129 shipping coupon → https://cnfans.com/register/?ref=571435"
Value‑first: "Cut costs fast: consolidate orders, pick economy lines, and apply a CNFANS shipping coupon. Start here → https://cnfans.com/register/?ref=571435"
How‑to angle: "Don't overpay for shipping. Learn how to use CNFANS coupons and grab current CNFANS shipping deals: https://cnfans.com/register/?ref=571435"

## What to highlight in your posts

Savings: "$129 CNFANS coupon", "CNFANS shipping discount", "cheap shipping CNFANS".
Simplicity: "Register → check Coupons → apply at checkout."
Proof: Before/after examples (separate vs consolidated parcel).
Timing: Mention seasonal promo periods (11.11, 12.12, Black Friday, Cyber Monday).

## Content formats that work

Tutorial Posts: "How to Get Cheap CNFANS Shipping in 2025"
1. Register via affiliate link
2. Check for welcome coupons
3. Consolidate multiple orders
4. Apply discount at checkout
5. Track savings over time

Comparison Content: "CNFANS vs Other Agents: Shipping Cost Breakdown"
- Show actual pricing examples
- Highlight coupon availability
- Compare consolidation options
- Include your referral link with disclosure

FAQ Content: "CNFANS Shipping Questions Answered"
- Address common concerns
- Link to registration with coupon info
- Provide step-by-step guides
- Share personal experiences

## Responsible promotion guidelines

Do:
Disclose relationships: "This is my referral link"
Provide value: Share genuine tips and experiences
Be honest: Don't exaggerate savings or benefits
Help users: Focus on solving their problems

Don't:
Spam communities: Follow platform rules
Make false claims: Stick to verified information
Hide commissions: Always disclose affiliate relationships
Pressure users: Let them decide based on value

## Getting started checklist

1. Sign up for CNFANS and test the platform yourself
2. Familiarize yourself with available coupons and shipping options
3. Create content that helps others save money
4. Choose platforms where your audience is active
5. Share responsibly with proper disclosures
6. Track results and optimize your approach
7. Build relationships within the shipping community

Remember: successful affiliate marketing comes from genuinely helping others while being transparent about your incentives. Focus on providing value, and the referrals will follow naturally.

Start by helping one person save money on shipping, then scale your efforts as you learn what works best for your audience and platform.
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