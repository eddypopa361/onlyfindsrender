import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomeFaqSection() {
  const faqs = [
    {
      question: "How do I make a purchase?",
      answer: "Simply click the 'Buy Now' button on any product you're interested in. You'll be redirected to our trusted seller's site where you can complete your purchase securely."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Our sellers accept various payment methods including major credit cards, PayPal, and some cryptocurrency options. Specific payment options will be shown at checkout."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location. Typically domestic orders arrive within 5-7 business days, while international orders may take 10-20 business days. Express shipping options are also available."
    },
    {
      question: "What's the quality of these products?",
      answer: "We showcase only top-tier replica products that closely match the authentic versions in appearance and quality. Each item is carefully selected for its craftsmanship."
    }
  ];

  return (
    <section className="py-16 relative" id="faq">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      <div className="bg-glow-left"></div>
      <div className="bg-glow-right"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto rounded-xl p-6 md:p-8 glow-card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold relative inline-block text-white glow-text">
              <span className="relative z-10">Frequently Asked Questions</span>
              <div className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></div>
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-heading font-medium text-primary-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-300">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <Link href="/faq">
              <Button variant="outline" className="border-primary text-primary-300 hover:bg-primary/20 glow-button">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}