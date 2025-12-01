# Authentication Fix for Profile System

## Issue
The profile API routes were returning 401 (Unauthorized) errors because the server-side routes couldn't access the user's session.

## Solution
Implemented Bearer token authentication using Authorization headers.

### Changes Made

#### 1. Created Server-Side Helper (`lib/supabase-server.ts`)
- `getUserFromRequest()` - Extracts and validates Bearer token from Authorization header
- Verifies token with Supabase
- Returns authenticated user

#### 2. Updated ProfileProvider (`components/ProfileProvider/ProfileProvider.tsx`)
- All API calls now include `Authorization: Bearer ${token}` header
- Token obtained from session: `session?.access_token`
- Functions updated:
  - `fetchProfile()`
  - `updateProfile()`
  - `uploadAvatar()`
  - `deleteAvatar()`

#### 3. Updated API Routes
All routes now use `getUserFromRequest(request)` instead of client-side auth:
- `app/api/profile/route.ts` (GET, PUT, DELETE)
- `app/api/profile/avatar/route.ts` (POST, DELETE)

#### 4. Updated Settings Page (`app/u/[username]/settings/page.tsx`)
- Accesses `session` from `useAuth()` hook
- Includes token in DELETE request for account deletion
- Properly handles sign out after account deletion

## Authentication Flow

```
Client (Browser)
    ↓
1. User logs in via Supabase Auth
    ↓
2. Session with access_token stored in AuthProvider
    ↓
3. ProfileProvider makes API call with token
    ↓
   fetch('/api/profile', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
    ↓
4. API Route extracts token from header
    ↓
5. getUserFromRequest() validates token with Supabase
    ↓
6. If valid, returns user object
    ↓
7. API performs authorized operation
    ↓
8. Response sent back to client
```

## How It Works

### Client Side
```typescript
// Get token from session
const { session } = useAuth();
const token = session?.access_token;

// Include in API request
await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Server Side
```typescript
// Extract and validate user from request
const { user, error } = await getUserFromRequest(request);

if (error || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// User is authenticated, proceed with operation
```

## Security Benefits

1. **Token-Based Auth**: Uses secure JWT tokens
2. **Stateless**: No session storage on server
3. **Supabase Validation**: Token verified by Supabase on each request
4. **Bearer Standard**: Follows OAuth 2.0 Bearer token standard
5. **Row Level Security**: Combined with RLS policies in Supabase

## Testing

To verify the fix works:

1. **Start the dev server**: `npm run dev`
2. **Log in** to the application
3. **Navigate to Settings** page
4. **Check browser console** - Should see successful API responses (200)
5. **Update profile** - Should save successfully
6. **Upload avatar** - Should work without 401 errors

## Error Handling

The system handles various auth scenarios:

- **No token**: Returns "No authentication token" error
- **Invalid token**: Supabase returns auth error
- **Expired token**: Automatically handled by AuthProvider refresh
- **No session**: User redirected to login

## Notes

- Account deletion now properly signs out the user
- Profile deletion happens server-side
- Auth user management handled client-side via Supabase
- All operations require valid authentication
- Token automatically refreshed by Supabase client

## Troubleshooting

### Still seeing 401 errors?
1. Check that user is logged in (`session` exists)
2. Verify token is being sent in headers (Network tab)
3. Check Supabase project is active
4. Verify environment variables are correct

### Profile not loading?
1. Ensure user has completed signup
2. Check that profile was created (trigger should auto-create)
3. Verify database migration ran successfully
4. Check browser console for specific errors

### Token expired?
- AuthProvider should auto-refresh
- If not, user needs to log in again
- Check Supabase session settings


