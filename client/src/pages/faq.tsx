import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";

export default function FAQ() {
  const faqs = [
    {
      question: "What is JOYAFINDS?",
      answer: "JOYAFINDS is a showcase platform connecting you to quality replica products at affordable prices. We don't sell products directly but provide links to trusted sellers."
    },
    {
      question: "How do I purchase products?",
      answer: "You can purchase products by clicking on the 'Buy Now' button for each product. This will redirect you to the seller's website where you can complete your purchase."
    },
    {
      question: "Are these authentic products?",
      answer: "No, the products showcased are replicas of designer items. We are transparent about this and focus on providing high-quality alternatives at affordable prices."
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
        <title>FAQ - JOYAFINDS</title>
        <meta name="description" content="Frequently asked questions about RepGalaxy and our products. Find answers to common questions about ordering, shipping, and returns." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-heading">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find answers to common questions about JOYAFINDS and our products
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
              By using JOYAFINDS, you agree to the following terms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>JOYAFINDS is a showcase platform and does not sell products directly</li>
              <li>We are not responsible for transactions conducted on third-party websites</li>
              <li>Product availability, pricing, and shipping are determined by individual sellers</li>
              <li>JOYAFINDS makes no warranties regarding the quality or authenticity of products</li>
              <li>Users are responsible for ensuring compliance with local laws regarding replica products</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              For our full terms of service and privacy policy, please visit the respective pages linked in the footer.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
