#!/bin/bash

# Quick Deploy to Vercel

echo "🚀 Code Explainer - Vercel Deployment"
echo "======================================"
echo ""

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this from the frontend/ directory"
    echo ""
    echo "cd frontend"
    echo "./deploy-vercel.sh"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent
echo "✅ Dependencies installed"
echo ""

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Deploy
echo "🌐 Deploying to Vercel..."
echo ""
vercel

echo ""
echo "✨ Done! Your app is live!"
