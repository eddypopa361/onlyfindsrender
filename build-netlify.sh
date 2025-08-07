#!/bin/bash
# Script pentru build complet Netlify

echo "🚀 Building for Netlify deployment..."

# Build principal
npm run build

# Copiază toate asset-urile necesare pentru Netlify
echo "📁 Copying static assets..."
cp -r public/data dist/
cp public/favicon.ico dist/
cp -r public/images dist/
cp -r uploads dist/

echo "✅ Build complet pentru Netlify!"
echo "📊 Build stats:"
echo "   - data/products.json: $(du -h dist/data/products.json | cut -f1)"
echo "   - favicon.ico: ✅"
echo "   - images/: $(ls dist/images/ | wc -l) fișiere"
echo "   - uploads/: $(ls dist/uploads/ | wc -l) fișiere"
echo ""
echo "🌐 Ready for Netlify deployment!"