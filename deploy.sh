#!/bin/bash

echo "🚀 Preparing VASA for Vercel deployment..."

# Clean previous builds
rm -rf dist

# Build with Vercel config
echo "📦 Building with Vercel configuration..."
npx vite build --config vite.config.vercel.ts

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Output directory: dist"
    echo "📄 Files created:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Ready for Vercel deployment!"
echo "📤 Push to GitHub and Vercel will auto-deploy"
