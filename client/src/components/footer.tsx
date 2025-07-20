import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <picture>
                <source srcSet="/uploads/joyafinds_logo.png.webp" type="image/webp" />
                <img 
                  src="/uploads/joyafinds_logo.png" 
                  alt="JOYAFINDS Logo" 
                  loading="lazy"
                  className="h-14 object-contain"
                />
              </picture>
            </div>
            <p className="text-gray-400 mb-4">
              Your go-to source for high-quality products at unbeatable prices.
            </p>
            {/* Social media icons removed as requested */}
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#bestsellers" className="text-gray-400 hover:text-primary transition-colors">Best Sellers</a>
              </li>
              <li>
                <a href="/products?category=Shoes" className="text-gray-400 hover:text-primary transition-colors">Shoes</a>
              </li>
              <li>
                <a href="/products?category=Clothing" className="text-gray-400 hover:text-primary transition-colors">Clothing</a>
              </li>
              <li>
                <a href="/products?category=Accessories" className="text-gray-400 hover:text-primary transition-colors">Accessories</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/howto" className="text-gray-400 hover:text-primary transition-colors">How to Order</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} <picture>
            <source srcSet="/uploads/joyafinds_logo.png.webp" type="image/webp" />
            <img src="/uploads/joyafinds_logo.png" alt="JOYAFINDS" loading="lazy" className="h-8 inline-block mx-1 object-contain" />
          </picture> All rights reserved.</p>
          <p className="mt-4 text-sm max-w-4xl mx-auto">
            JOYAFINDS does not sell any physical products and neither do the agents provided. This website is purely a catalog of links to Taobao, Weidian, and other shopping sites to better educate buyers and help them avoid scams. JOYAFINDS is not affiliated with Weidian.com, Taobao.com, 1688.com, tmall.com, or any other shopping platform ('platforms'). This is not an official offer from those platforms. All links on this site are affiliate links, including price tag buttons, -tagged links, and links embedded in images. We do not earn a commission from the sale of any products, but rather from the function of acting as a freight forwarder. We are not an online store and do not sell any products.
          </p>
        </div>
      </div>
    </footer>
  );
}
