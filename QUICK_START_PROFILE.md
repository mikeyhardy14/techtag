# Quick Start Guide - Profile System

This guide will help you get the Supabase profile system up and running in just a few minutes.

## Prerequisites

- Supabase account and project created
- Environment variables configured in `.env.local`

## Step-by-Step Setup

### 1. Install Dependencies (if needed)

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Run the Database Migration

Open your Supabase Dashboard:
1. Navigate to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/migrations/001_create_profiles.sql`
4. Click **Run** or press `Ctrl+Enter`

You should see: "Success. No rows returned"

### 3. Create Storage Bucket for Avatars

In your Supabase Dashboard:
1. Navigate to **Storage**
2. Click **New bucket**
3. Enter bucket name: `profiles`
4. Make it **Public**
5. Click **Create bucket**

### 4. Verify Environment Variables

Your `.env.local` should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Test the Profile System

1. **Sign Up**: Navigate to `/signup` and create a new account
2. **Login**: Sign in with your credentials
3. **Settings**: Go to `/u/[your-username]/settings`
4. **Update Profile**: Fill in your profile information
5. **Upload Avatar**: Click on the avatar placeholder to upload an image
6. **Save**: Click "SAVE CHANGES"

## What Got Created?

### Database
- ✅ `profiles` table with all user data
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation trigger
- ✅ Username uniqueness constraint
- ✅ Auto-updating timestamps

### Storage
- ✅ `profiles` bucket for avatar images
- ✅ Public access configured
- ✅ File upload validation

### API Routes
- ✅ `GET /api/profile` - Get current user profile
- ✅ `PUT /api/profile` - Update profile
- ✅ `DELETE /api/profile` - Delete account
- ✅ `POST /api/profile/avatar` - Upload avatar
- ✅ `DELETE /api/profile/avatar` - Delete avatar
- ✅ `GET /api/profile/[username]` - Get public profile

### Components
- ✅ `ProfileProvider` - React context for profile state
- ✅ Updated Settings page with full profile management
- ✅ Avatar upload functionality
- ✅ Form validation

## Testing Checklist

- [ ] Create a new account
- [ ] Profile automatically created
- [ ] Update display name
- [ ] Upload avatar image
- [ ] Delete avatar
- [ ] Change notification preferences
- [ ] Change theme preference
- [ ] Change privacy settings
- [ ] View settings persistence after refresh
- [ ] Test account deletion (optional)

## Common Issues

### "Profile not found"
- Make sure you're logged in
- Check that the trigger created your profile
- Manually check the profiles table in Supabase

### Avatar upload fails
- Verify storage bucket is public
- Check file size (must be < 5MB)
- Check file type (JPEG, PNG, GIF, WebP only)

### Settings not saving
- Check browser console for errors
- Verify API routes are accessible
- Check network tab for failed requests

## Next Steps

- Customize the profile fields for your needs
- Add more preferences
- Create a public profile view page
- Add profile completion percentage
- Add social media links

## Need Help?

- 📚 Check the full documentation: `PROFILE_SYSTEM_SETUP.md`
- 🐛 Check browser console for errors
- 🔍 Review Supabase logs in Dashboard
- 📧 Contact support if needed

---

**Estimated Setup Time**: 10-15 minutes

**Once completed, you'll have**:
- ✨ Full user profile management
- 🖼️ Avatar upload/delete
- ⚙️ User preferences and settings
- 🔒 Privacy controls
- 📱 Notification preferences

