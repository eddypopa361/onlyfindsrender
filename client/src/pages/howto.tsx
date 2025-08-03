import { Helmet } from "react-helmet";
import { CNFANS_REGISTER } from "@/lib/constants";

export default function HowToOrder() {
  return (
    <>
      <Helmet>
        <title>How To Order | ONLYFINDS</title>
        <meta 
          name="description" 
          content="Learn how to place an order on CNFANS, the trusted platform for high-quality replicas. Step-by-step tutorial and guide." 
        />
      </Helmet>

      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-16">
          {/* Header section with title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-7xl font-heading font-bold mb-6 text-white glow-text">
              HOW TO ORDER
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Follow this simple guide to place your first order on CNFANS and get your favorite items delivered to your door.
            </p>
          </div>

          {/* Video tutorial temporarily hidden as requested */}

          {/* Step by step guide */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8 text-white">
                Step-by-Step Guide
              </h2>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Sign Up for CNFANS</h3>
                    <p className="text-gray-300">
                      Create your account on CNFANS using our special referral link to get $129 coupons. Click the "GET $129 COUPONS" button on our website to be redirected to the sign-up page.
                    </p>
                    <a 
                      href={CNFANS_REGISTER} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="relative inline-block mt-4 group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                      <button className="relative px-5 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/80 transition-colors">
                        Sign Up Now
                      </button>
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Find Products on ONLYFINDS</h3>
                    <p className="text-gray-300">
                      Browse our extensive catalog to find the products you want. Use the filters to narrow down by category, brand, or use the search function. Click on "VIEW" to see product details or "BUY" to be redirected to the CNFANS product page.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Add to Cart & Checkout</h3>
                    <p className="text-gray-300">
                      Once on CNFANS, add the item to your cart, select your size and preferences. Proceed to checkout and fill in your shipping information. Review your order before finalizing the purchase.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Track Your Order</h3>
                    <p className="text-gray-300">
                      After completing your purchase, you'll receive an order confirmation. You can track your package status through your CNFANS account. If you have any questions, contact CNFANS customer service directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional tips */}
            <div className="mt-12 bg-gray-900/50 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-heading font-bold mb-6 text-white">
                Pro Tips
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li>Sign up with our referral link for 50% off shipping</li>
                <li>Order multiple items to save on shipping costs</li>
                <li>Check our site regularly for new arrivals and promotions</li>
                <li>For questions about products or orders, contact CNFANS customer service directly</li>
              </ul>
            </div>

            {/* CTA at the bottom */}
            <div className="mt-12 text-center">
              <a 
                href="/products" 
                className="relative inline-block group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <button className="relative px-8 py-4 bg-primary text-white font-heading font-medium rounded-full transition-all hover:bg-primary/80 text-lg">
                  Browse Products Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}