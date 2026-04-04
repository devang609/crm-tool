#!/bin/bash

# Verification script to ensure everything is set up correctly

echo "🔍 CRM Application Verification"
echo "================================"

# Check Node version
NODE_VERSION=$(node -v)
echo "✅ Node.js: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
echo "✅ npm: $NPM_VERSION"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please create it with your Supabase credentials."
    exit 1
fi

# Check if env variables are set (not empty)
if grep -q "your_supabase" .env.local; then
    echo "❌ Supabase credentials not configured properly in .env.local"
    echo "   Replace placeholders with actual values from Supabase"
    exit 1
fi

echo "✅ .env.local configured"

# Check if app folder exists
if [ ! -d "app" ]; then
    echo "❌ app/ folder not found"
    exit 1
fi

echo "✅ Project structure verified"

# Check if lib/supabase/client.ts exists
if [ -f "lib/supabase/client.ts" ]; then
    echo "✅ Supabase client configured"
else
    echo "❌ Supabase client not found"
    exit 1
fi

echo ""
echo "🎉 All checks passed! You're ready to go."
echo ""
echo "Next steps:"
echo "1. Ensure your Supabase database is set up (see README.md)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 in your browser"
