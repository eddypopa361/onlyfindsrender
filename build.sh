#!/bin/bash
set -e

echo "🏗️ Starting build process..."

echo "📦 Building frontend with Vite..."
vite build

echo "🔧 Building backend with esbuild..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "📁 Creating required directory structure..."
mkdir -p dist/public
mkdir -p server/public

echo "📋 Copying frontend files to dist/public (for deployment)..."
cp -r dist/index.html dist/assets dist/public/ 2>/dev/null || true

echo "📋 Copying public assets to dist/public..."
cp -r public/* dist/public/ 2>/dev/null || true

echo "📋 Copying all files to server/public (for serveStatic compatibility)..."
cp -r dist/public/* server/public/ 2>/dev/null || true

echo "✅ Build complete!"
echo "📍 Frontend files available at: dist/public/"
echo "📍 Backend server available at: dist/index.js"
echo "📍 Static files for development: server/public/"

# Verify the build
echo ""
echo "🔍 Verifying build output..."
if [ -f "dist/public/index.html" ] && [ -f "dist/index.js" ]; then
    echo "✅ Build verification successful!"
    echo "   - Frontend: dist/public/index.html exists"
    echo "   - Backend: dist/index.js exists"
    echo "   - Assets: $(ls -1 dist/public/assets/ | wc -l) asset files"
else
    echo "❌ Build verification failed!"
    exit 1
fi