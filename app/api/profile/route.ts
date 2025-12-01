import { NextRequest, NextResponse } from 'next/server';
import { profiles } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/supabase-server';

// GET - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const { user, error: authError } = await getUserFromRequest(request);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile
    const { profile, error } = await profiles.getProfile(user.id);
    
    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const { user, error: authError } = await getUserFromRequest(request);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const updates = await request.json();

    // Validate username if provided
    if (updates.username) {
      const { available, error: checkError } = await profiles.isUsernameAvailable(
        updates.username,
        user.id
      );
      
      if (checkError) {
        return NextResponse.json(
          { error: 'Failed to validate username' },
          { status: 500 }
        );
      }
      
      if (!available) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Update profile
    const { profile, error } = await profiles.updateProfile(user.id, updates);
    
    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete current user's profile and account
export async function DELETE(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const { user, error: authError } = await getUserFromRequest(request);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete profile
    const { error: deleteError } = await profiles.deleteProfile(user.id);
    
    if (deleteError) {
      console.error('Profile deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete profile' },
        { status: 500 }
      );
    }

    // Note: Auth user deletion should be handled on the client side
    // The profile is deleted here, and the client should call signOut and delete the auth user
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

