import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="cookie-card relative max-w-80 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="pr-6">
          <span className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            🍪 Cookie Notice
          </span>
          
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We use cookies to ensure that we give you the best experience on our website.{' '}
            <a 
              href="/faq" 
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Read our privacy policy
            </a>
            .
          </p>
          
          <div className="flex items-center justify-between mt-4 gap-3">
            <button 
              onClick={handleClose}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline transition-colors bg-transparent border-none cursor-pointer"
            >
              Manage preferences
            </button>
            
            <button 
              onClick={handleAccept}
              className="text-xs font-medium bg-gray-900 dark:bg-primary hover:bg-gray-700 dark:hover:bg-primary/80 text-white px-4 py-2.5 rounded-lg border-none cursor-pointer transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;