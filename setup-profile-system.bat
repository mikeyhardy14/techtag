@echo off
REM Profile System Setup Script for Windows
REM This script helps set up the Supabase profile system

echo.
echo 🚀 Setting up Profile System with Supabase...
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ Error: .env.local file not found
    echo 📝 Please create .env.local with the following variables:
    echo    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    exit /b 1
)

REM Check if environment variables are set
findstr /C:"NEXT_PUBLIC_SUPABASE_URL" .env.local >nul
if errorlevel 1 (
    echo ❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local
    exit /b 1
)

findstr /C:"NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local >nul
if errorlevel 1 (
    echo ❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local
    exit /b 1
)

echo ✅ Environment variables configured
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Install Supabase packages
echo 📦 Checking Supabase packages...
call npm list @supabase/supabase-js >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing @supabase/supabase-js...
    call npm install @supabase/supabase-js
)

call npm list @supabase/auth-helpers-nextjs >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing @supabase/auth-helpers-nextjs...
    call npm install @supabase/auth-helpers-nextjs
)

echo ✅ Dependencies installed
echo.

REM Display next steps
echo 📋 Next Steps:
echo.
echo 1. Run the SQL migration in Supabase:
echo    - Open Supabase Dashboard ^> SQL Editor
echo    - Copy contents from: supabase/migrations/001_create_profiles.sql
echo    - Execute the SQL
echo.
echo 2. Create Storage Bucket:
echo    - Open Supabase Dashboard ^> Storage
echo    - Click 'New bucket'
echo    - Name: 'profiles'
echo    - Make it public
echo    - Click 'Create bucket'
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo 4. Test the profile system:
echo    - Sign up or log in
echo    - Navigate to Settings
echo    - Update your profile
echo    - Upload an avatar
echo.
echo 📚 For more information, see: PROFILE_SYSTEM_SETUP.md
echo.
echo ✨ Setup complete!
echo.
pause

