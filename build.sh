#!/bin/bash
set -e

echo "Building client..."
npm run build

echo "Creating required directory structure..."
# Create both structures for deployment and serveStatic compatibility
mkdir -p dist/public
mkdir -p server/public

echo "Copying built files to dist/public (for deployment)..."
cp -r dist/* dist/public/ 2>/dev/null || true

echo "Copying built files to server/public (for serveStatic)..."
cp -r dist/* server/public/ 2>/dev/null || true

echo "Build complete! Both dist/public and server/public are ready."