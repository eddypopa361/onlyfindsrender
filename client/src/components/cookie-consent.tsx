import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      // Show cookie banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const toggleCustomizePanel = () => {
    setShowCustomizePanel(!showCustomizePanel);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-bold mb-2">Cookies and GDPR!</h3>
            <p className="text-xs md:text-sm">
              For purposes such as displaying personalized content, we use cookies or similar technologies. 
              By clicking "Accept", you agree to allow the collection of information through cookies or similar technologies.
            </p>
            <a href="/cookie" className="text-xs text-primary hover:underline">
              Cookie Policy
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="text-xs md:text-sm border-primary text-primary hover:bg-primary/10"
              onClick={toggleCustomizePanel}
            >
              Customize Consent
            </Button>
            <Button 
              className="text-xs md:text-sm bg-primary text-white hover:bg-primary/80"
              onClick={acceptAllCookies}
            >
              Accept All
            </Button>
          </div>
        </div>

        {showCustomizePanel && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Customize Consent Preferences</h4>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleCustomizePanel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Necessary</h5>
                  <p className="text-xs text-gray-500">Required to enable the basic features of this site</p>
                </div>
                <div className="bg-gray-200 py-1 px-2 rounded text-xs">Always Active</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Functional</h5>
                  <p className="text-xs text-gray-500">Enables sharing content and collecting feedback</p>
                </div>
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Analytics</h5>
                  <p className="text-xs text-gray-500">Helps understand how visitors interact with the site</p>
                </div>
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Advertisement</h5>
                  <p className="text-xs text-gray-500">Used to provide visitors with customized advertisements</p>
                </div>
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary" />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="text-primary border-primary"
                  onClick={toggleCustomizePanel}
                >
                  Save My Preferences
                </Button>
                <Button 
                  className="bg-primary text-white hover:bg-primary/80"
                  onClick={acceptAllCookies}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
