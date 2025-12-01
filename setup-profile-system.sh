#!/bin/bash

# Profile System Setup Script
# This script helps set up the Supabase profile system

echo "🚀 Setting up Profile System with Supabase..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "📝 Please create .env.local with the following variables:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    exit 1
fi

# Check if environment variables are set
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    exit 1
fi

if ! grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Supabase packages are installed
if ! npm list @supabase/supabase-js &> /dev/null; then
    echo "📦 Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

if ! npm list @supabase/auth-helpers-nextjs &> /dev/null; then
    echo "📦 Installing @supabase/auth-helpers-nextjs..."
    npm install @supabase/auth-helpers-nextjs
fi

echo "✅ Dependencies installed"
echo ""

# Display next steps
echo "📋 Next Steps:"
echo ""
echo "1. Run the SQL migration in Supabase:"
echo "   - Open Supabase Dashboard > SQL Editor"
echo "   - Copy contents from: supabase/migrations/001_create_profiles.sql"
echo "   - Execute the SQL"
echo ""
echo "2. Create Storage Bucket:"
echo "   - Open Supabase Dashboard > Storage"
echo "   - Click 'New bucket'"
echo "   - Name: 'profiles'"
echo "   - Make it public"
echo "   - Click 'Create bucket'"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Test the profile system:"
echo "   - Sign up or log in"
echo "   - Navigate to Settings"
echo "   - Update your profile"
echo "   - Upload an avatar"
echo ""
echo "📚 For more information, see: PROFILE_SYSTEM_SETUP.md"
echo ""
echo "✨ Setup complete!"

