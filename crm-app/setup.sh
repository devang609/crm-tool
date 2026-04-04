#!/bin/bash

# CRM Application - Quick Setup Script

echo "🚀 CRM Application Setup"
echo "========================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo ""
    echo "Please create .env.local with the following variables:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo ""
    echo "Get these from your Supabase project settings."
    exit 1
fi

echo "✅ .env.local found"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Start development server
echo "🌐 Starting development server..."
npm run dev
