import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";

export default function FAQ() {
  const faqs = [
    {
      question: "What is ONLYFINDS?",
      answer: "ONLYFINDS is a showcase platform connecting you to quality replica products at affordable prices. We don't sell products directly but provide links to trusted sellers."
    },
    {
      question: "How do I purchase products?",
      answer: "You can purchase products by clicking on the 'Buy Now' button for each product. This will redirect you to the seller's website where you can complete your purchase."
    },
    {
      question: "Are these authentic products?",
      answer: "The products showcased are designer-inspired alternatives. We focus on providing high-quality finds at affordable prices with transparent information about each item."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Payment methods depend on the seller you're redirected to. Most sellers accept major credit cards, PayPal, and some cryptocurrency options."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary depending on the seller and your location. Typically, international shipping takes 1-3 weeks. More specific information will be provided on the seller's website."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Return and exchange policies are determined by the individual sellers. Please review their policies before making a purchase."
    },
    {
      question: "How can I contact customer support?",
      answer: "For questions about our platform, you can visit our Contact page. For questions about specific products or orders, please contact the seller directly."
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - ONLYFINDS</title>
        <meta name="description" content="Frequently asked questions about ONLYFINDS and CNFANS shopping. Get $129 coupons, learn about shipping savings, and find answers to ordering questions." />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="FAQ - ONLYFINDS" />
        <meta property="og:description" content="Frequently asked questions about ONLYFINDS and CNFANS shopping. Get $129 coupons, learn about shipping savings, and find answers to ordering questions." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://onlyfinds.netlify.app/onlyfinds.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ - ONLYFINDS" />
        <meta name="twitter:description" content="Frequently asked questions about ONLYFINDS and CNFANS shopping. Get $129 coupons, learn about shipping savings, and find answers to ordering questions." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-heading">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find answers to common questions about ONLYFINDS and our products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-heading font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Shipping times and methods vary depending on the seller and your location. Here's what you can generally expect:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Domestic shipping: 3-7 business days</li>
              <li>International shipping: 7-21 business days</li>
              <li>Express shipping options are available with most sellers for an additional fee</li>
              <li>Tracking information is typically provided for all orders</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              For specific shipping information, please check the seller's website before completing your purchase.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Terms of Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              By using ONLYFINDS, you agree to the following terms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>ONLYFINDS is a showcase platform and does not sell products directly</li>
              <li>We are not responsible for transactions conducted on third-party websites</li>
              <li>Product availability, pricing, and shipping are determined by individual sellers</li>
              <li>ONLYFINDS makes no warranties regarding the quality or authenticity of products</li>
              <li>Users are responsible for ensuring compliance with local laws regarding replica products</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              For our full terms of service and privacy policy, please visit the respective pages linked in the footer.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Privacy Policy</CardTitle>
            <CardDescription className="text-sm text-gray-600">Last updated: August 3, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Who we are</h4>
              <p className="text-gray-700 text-sm">
                ONLYFINDS ("we", "us", "our") operates a product discovery website. This policy explains what we collect, how we use it, and your choices.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">What we collect</h4>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Usage data: pages viewed, clicks, approximate location (derived from IP), device/browser info, and referral source.</li>
                <li>Account/contact info (optional): if you sign up for updates or contact us, we collect your email and any info you submit.</li>
                <li>Cookies & similar: used for core functionality (e.g., session, preferences) and analytics/performance.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payments & partners</h4>
              <p className="text-gray-700 text-sm">
                We do not process or store payment information on ONLYFINDS. Some buttons and links (e.g., "Get $129 coupons", "JOIN CNFANS NOW") send you to partners such as CNFANS. When you follow those links, the partner may collect data under their own policy. Please review their privacy policy before purchasing.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How we use data</h4>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Provide, secure, and improve the site and its features</li>
                <li>Measure performance and fix issues</li>
                <li>Communicate with you when you ask us to (e.g., email updates)</li>
              </ul>
              <p className="text-gray-700 text-sm mt-2">We do not sell your personal data.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Your rights</h4>
              <p className="text-gray-700 text-sm">
                Depending on your location, you may have rights to access, correct, delete, restrict or object to processing, and data portability. You can also withdraw consent where processing is based on consent. To make a request, contact <a href="mailto:3lucaswreps@gmail.com" className="text-primary hover:underline">3lucaswreps@gmail.com</a>.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Children</h4>
              <p className="text-gray-700 text-sm">
                ONLYFINDS is not intended for children under 13 (or the age required by local law). We do not knowingly collect data from children.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-gray-700 text-sm">
                For questions about this privacy policy, contact us at <a href="mailto:3lucaswreps@gmail.com" className="text-primary hover:underline">3lucaswreps@gmail.com</a>
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Changes</h4>
              <p className="text-gray-700 text-sm">
                We may update this policy from time to time. Material changes will be noted on this page with a new "Last updated" date.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
