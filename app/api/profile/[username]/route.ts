import { NextRequest, NextResponse } from 'next/server';
import { profiles } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Get profile by username
    const { profile, error } = await profiles.getProfileByUsername(username);
    
    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Only return public profiles
    if (profile.profile_visibility !== 'public') {
      return NextResponse.json(
        { error: 'Profile is private' },
        { status: 403 }
      );
    }

    // Remove sensitive information
    const publicProfile = {
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
      job_title: profile.job_title,
      company: profile.company,
      created_at: profile.created_at,
    };

    return NextResponse.json({ profile: publicProfile });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

