import { NextRequest, NextResponse } from 'next/server';
import { profiles } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const { user, error: authError } = await getUserFromRequest(request);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get current profile to delete old avatar
    const { profile: currentProfile } = await profiles.getProfile(user.id);
    
    if (currentProfile?.avatar_url) {
      await profiles.deleteAvatar(currentProfile.avatar_url);
    }

    // Upload new avatar
    const { avatarUrl, error: uploadError } = await profiles.uploadAvatar(user.id, file);
    
    if (uploadError || !avatarUrl) {
      console.error('Avatar upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      );
    }

    // Update profile with new avatar URL
    const { profile, error: updateError } = await profiles.updateProfile(user.id, {
      avatar_url: avatarUrl
    });
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile with avatar URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      avatar_url: avatarUrl,
      profile 
    });
  } catch (error) {
    console.error('Avatar upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get current profile
    const { profile } = await profiles.getProfile(user.id);
    
    if (!profile?.avatar_url) {
      return NextResponse.json(
        { error: 'No avatar to delete' },
        { status: 404 }
      );
    }

    // Delete avatar from storage
    const { error: deleteError } = await profiles.deleteAvatar(profile.avatar_url);
    
    if (deleteError) {
      console.error('Avatar deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete avatar' },
        { status: 500 }
      );
    }

    // Update profile to remove avatar URL
    const { profile: updatedProfile, error: updateError } = await profiles.updateProfile(user.id, {
      avatar_url: null
    });
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Avatar deletion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

