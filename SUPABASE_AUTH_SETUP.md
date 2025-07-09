# Supabase Authentication Setup Guide

## Overview
This guide explains how to configure Supabase authentication for your TechTag application. The system provides secure email/password authentication with automatic user management.

## Prerequisites
- Supabase project created
- Environment variables configured

## Required Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Configuration

### 1. Enable Email Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable "Enable email confirmations" (recommended)
3. Set your Site URL to `http://localhost:3000` (development) or your production domain

### 2. Configure Email Templates (Optional)
1. Go to Authentication > Templates
2. Customize the confirmation and password reset email templates

### 3. Set Authentication Policies
The auth system automatically creates users in Supabase's `auth.users` table. No additional setup needed for basic authentication.

## Features

### ✅ Implemented Features
- **User Registration**: Email/password signup with confirmation
- **User Login**: Secure email/password authentication
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic session handling
- **Protected Routes**: Dashboard requires authentication
- **Sign Out**: Secure logout functionality
- **Responsive UI**: Modern, mobile-friendly forms

### 🔒 Security Features
- Secure password requirements (minimum 6 characters)
- Automatic session refresh
- Protected API routes
- Email verification (configurable)

## Usage

### Registration Flow
1. User visits `/signup`
2. Enters email and password
3. Receives confirmation email (if enabled)
4. Account is activated

### Login Flow
1. User visits `/login`
2. Enters credentials
3. Redirects to dashboard on success
4. Session persists across browser sessions

### Password Reset Flow
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Receives reset email with secure link
4. Sets new password

## Protected Routes

The following routes require authentication:
- `/u/[username]/dashboard` - User dashboard
- Any route using the `useAuth` hook

## Components

### AuthProvider
Manages global authentication state and provides auth methods.

### useAuth Hook
Provides access to:
- `user` - Current authenticated user
- `session` - Current session
- `loading` - Authentication loading state
- `signIn(email, password)` - Login method
- `signUp(email, password)` - Registration method
- `signOut()` - Logout method
- `resetPassword(email)` - Password reset method

## Customization

### Styling
All auth forms use CSS modules for styling:
- `app/login/page.module.css`
- `app/signup/page.module.css` 
- `app/auth/forgot-password/page.module.css`

### Email Templates
Configure in Supabase dashboard under Authentication > Templates.

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check email/password combination
   - Ensure user account exists and is confirmed

2. **Environment variables not found**
   - Verify `.env.local` file exists in project root
   - Restart development server after adding variables

3. **Email confirmation not working**
   - Check Supabase email settings
   - Verify SMTP configuration in Supabase

4. **Redirect not working**
   - Check Site URL in Supabase settings
   - Ensure URL matches your domain exactly

### Debug Mode
Add `console.log` statements in auth functions to debug issues:

```javascript
const { data, error } = await signIn(email, password);
console.log('Auth result:', { data, error });
```

## Production Deployment

1. Update environment variables with production values
2. Set correct Site URL in Supabase
3. Configure custom email templates
4. Enable email confirmations
5. Set up proper domain verification

## Support

For issues related to:
- **Supabase Auth**: Check [Supabase Auth docs](https://supabase.com/docs/guides/auth)
- **Application Issues**: Review error logs and component implementation 