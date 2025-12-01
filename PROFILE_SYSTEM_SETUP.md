# Profile System Documentation

## Overview
This profile system uses Supabase as the primary data store for user information, preferences, and settings. It provides a comprehensive solution for managing user profiles with avatar uploads, preferences, notifications, and privacy controls.

## Architecture

### Database Schema
The profile system uses a PostgreSQL table in Supabase with the following structure:

**profiles table:**
- `id` (UUID) - Primary key, foreign key to auth.users
- `email` (TEXT) - User email address (unique)
- `username` (TEXT) - Unique username (nullable)
- `display_name` (TEXT) - Display name for the user
- `avatar_url` (TEXT) - URL to user's profile picture
- `job_title` (TEXT) - User's job title
- `company` (TEXT) - User's company
- `phone` (TEXT) - Phone number
- `bio` (TEXT) - User biography
- `website` (TEXT) - Personal website URL
- `location` (TEXT) - User location

**Notification Preferences:**
- `email_notifications` (BOOLEAN) - Default: true
- `push_notifications` (BOOLEAN) - Default: false
- `sms_notifications` (BOOLEAN) - Default: false

**App Preferences:**
- `theme` (TEXT) - 'light' | 'dark' | 'auto'
- `language` (TEXT) - Default: 'en'
- `timezone` (TEXT) - Default: 'UTC-5'
- `default_view` (TEXT) - Default landing page

**Privacy Settings:**
- `profile_visibility` (TEXT) - 'public' | 'private'
- `data_sharing` (BOOLEAN) - Default: false
- `analytics` (BOOLEAN) - Default: true

**Metadata:**
- `created_at` (TIMESTAMP) - Profile creation time
- `updated_at` (TIMESTAMP) - Last update time
- `last_login_at` (TIMESTAMP) - Last login timestamp

### Row Level Security (RLS)
The profiles table has RLS enabled with the following policies:
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile
- Public profiles can be viewed by anyone (when profile_visibility = 'public')

### Automatic Profile Creation
A trigger automatically creates a profile entry when a new user signs up through Supabase Auth.

## API Routes

### GET /api/profile
Get the current user's profile.

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    // ... other fields
  }
}
```

### PUT /api/profile
Update the current user's profile.

**Request Body:**
```json
{
  "display_name": "John Doe",
  "job_title": "HVAC Engineer",
  "company": "ACME Corp",
  // ... any other profile fields
}
```

**Response:**
```json
{
  "profile": {
    // Updated profile object
  }
}
```

### DELETE /api/profile
Delete the current user's profile and account (requires confirmation).

**Response:**
```json
{
  "success": true
}
```

### POST /api/profile/avatar
Upload a new avatar image.

**Request:**
- Form data with 'avatar' file field
- Accepts: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Response:**
```json
{
  "avatar_url": "https://...",
  "profile": {
    // Updated profile object
  }
}
```

### DELETE /api/profile/avatar
Delete the current user's avatar.

**Response:**
```json
{
  "success": true,
  "profile": {
    // Updated profile object
  }
}
```

### GET /api/profile/[username]
Get a public profile by username.

**Response:**
```json
{
  "profile": {
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "...",
    // Only public fields
  }
}
```

## React Components

### ProfileProvider
Context provider that manages profile state and provides profile operations.

**Usage:**
```tsx
import { useProfile } from '@/components/ProfileProvider/ProfileProvider';

function MyComponent() {
  const { profile, updateProfile, uploadAvatar, loading } = useProfile();
  
  // Use profile data and methods
}
```

**Available Methods:**
- `profile` - Current profile object
- `loading` - Loading state
- `error` - Error message if any
- `updateProfile(updates)` - Update profile fields
- `uploadAvatar(file)` - Upload new avatar
- `deleteAvatar()` - Delete current avatar
- `refreshProfile()` - Manually refresh profile data

## Setup Instructions

### 1. Run Database Migration
Execute the SQL migration file in your Supabase SQL editor:
```bash
supabase/migrations/001_create_profiles.sql
```

### 2. Create Storage Bucket
In Supabase Dashboard > Storage:
1. Create a new bucket named `profiles`
2. Set it to public (for avatar images)
3. Configure CORS if needed

### 3. Environment Variables
Ensure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Install Dependencies
If not already installed:
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Features

### ✅ Implemented Features
- **Profile Management**: Complete CRUD operations
- **Avatar Upload**: Image upload with validation
- **Preferences**: Theme, language, timezone, default view
- **Notifications**: Email, push, SMS notification settings
- **Privacy Controls**: Profile visibility, data sharing, analytics
- **Username Validation**: Check username availability
- **Automatic Profile Creation**: Triggered on user signup
- **Last Login Tracking**: Updates on each login
- **Account Deletion**: Complete account removal

### 🔒 Security Features
- Row Level Security (RLS) policies
- File type validation for uploads
- File size limits (5MB for avatars)
- Username uniqueness validation
- Double confirmation for account deletion
- Private/public profile visibility

## Usage Examples

### Updating Profile
```tsx
const { updateProfile } = useProfile();

const handleSave = async () => {
  const success = await updateProfile({
    display_name: 'John Doe',
    job_title: 'Senior Engineer',
    company: 'ACME Corp'
  });
  
  if (success) {
    console.log('Profile updated!');
  }
};
```

### Uploading Avatar
```tsx
const { uploadAvatar } = useProfile();

const handleAvatarUpload = async (file: File) => {
  const success = await uploadAvatar(file);
  
  if (success) {
    console.log('Avatar uploaded!');
  }
};
```

### Checking Profile Visibility
```tsx
const { profile } = useProfile();

if (profile?.profile_visibility === 'public') {
  // Profile is public
}
```

## Troubleshooting

### Profile Not Loading
1. Check if user is authenticated
2. Verify Supabase credentials in `.env.local`
3. Check browser console for errors
4. Verify RLS policies are set correctly

### Avatar Upload Failing
1. Check file type (must be JPEG, PNG, GIF, or WebP)
2. Check file size (must be under 5MB)
3. Verify storage bucket exists and is public
4. Check CORS configuration in Supabase

### Username Already Taken
The system checks username availability before updating. Try a different username.

### Cannot Delete Account
Ensure you're clicking through both confirmation dialogs. Check console for errors.

## Best Practices

1. **Always validate user input** - The system validates on both client and server
2. **Handle errors gracefully** - Display user-friendly error messages
3. **Optimize avatar images** - Consider resizing before upload
4. **Cache profile data** - The ProfileProvider handles this automatically
5. **Respect privacy settings** - Check profile_visibility before displaying profiles

## Migration from Existing System

If you're migrating from an existing user system:

1. Export existing user data
2. Transform to match profile schema
3. Import using Supabase bulk insert
4. Update user IDs to match Supabase auth IDs
5. Test RLS policies with various user accounts

## Future Enhancements

Potential features to add:
- Profile cover images
- Social media links
- Two-factor authentication
- Email change workflow
- Profile verification badges
- Activity history
- Profile analytics
- Export user data feature

## Support

For issues or questions:
- Check the Supabase documentation
- Review the code comments
- Check browser console for errors
- Test API routes directly using tools like Postman

