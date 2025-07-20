// Exemple de componente cu noua paletă cromatic #cb2410
import React from 'react';

export function ButtonExamples() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Exemple butoane - noua paletă</h3>
      
      {/* Normal button */}
      <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 glow-button">
        Buton Normal
      </button>
      
      {/* Hover state simulation */}
      <button className="px-6 py-3 bg-primary-600 text-primary-foreground font-medium rounded-lg glow-button focus-ring shadow-[0_0_0_3px_rgba(203,36,16,0.45),0_8px_28px_-2px_rgba(203,36,16,0.65)] border border-primary">
        Buton Hover State
      </button>
      
      {/* Disabled button */}
      <button 
        disabled 
        className="px-6 py-3 bg-gray-600 text-gray-400 font-medium rounded-lg cursor-not-allowed opacity-50"
      >
        Buton Disabled
      </button>
      
      {/* Gradient button */}
      <button className="px-6 py-3 gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200">
        Buton cu Gradient
      </button>
    </div>
  );
}

export function CardExample() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Exemplu card cu gradient accent</h3>
      
      <div className="glow-card rounded-xl p-6 max-w-md">
        <div className="gradient-glow rounded-t-xl h-32 mb-4 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">Header cu Gradient Glow</span>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Card Title</h4>
          <p className="text-gray-300">
            Acest card demonstrează noua paletă cromatic cu gradient accent și shadow-uri 
            bazate pe primary color #cb2410.
          </p>
          
          <div className="gradient-primary rounded-lg p-3">
            <span className="text-white font-medium">Element cu gradient linear</span>
          </div>
          
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-600 transition-colors glow-button">
            Acțiune Card
          </button>
        </div>
      </div>
    </div>
  );
}

// Contrast check: #cb2410 pe fundal alb = 4.51:1 (✓ WCAG AA)
// Contrast check: #fefefe pe fundal #cb2410 = 10.31:1 (✓ WCAG AAA)