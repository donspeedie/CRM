#!/bin/bash

# CRM Quick Start Script
# This script helps you set up your CRM quickly

echo "🚀 CRM Setup - Operation Alpha"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "Copying .env.example to .env.local..."
    cp .env.example .env.local
    echo ""
    echo "📝 IMPORTANT: Edit .env.local with your Firebase credentials!"
    echo "   1. Go to https://console.firebase.google.com/"
    echo "   2. Create a new project"
    echo "   3. Get your config from Project Settings"
    echo "   4. Paste values into .env.local"
    echo ""
    read -p "Press Enter when you've updated .env.local..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Make sure .env.local has your Firebase credentials"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo "   4. Sign up with your email"
echo ""
echo "📚 Check README.md for detailed instructions"
echo ""

# Ask if they want to start dev server
read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting dev server..."
    echo "Open http://localhost:3000 in your browser"
    echo ""
    npm run dev
fi
