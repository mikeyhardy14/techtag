import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Profile, ProfileUpdate } from '@/types/profile';

// Server-side Supabase client for API routes
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  // Get the access token from cookies
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  });

  return supabase;
}

// Admin client that bypasses RLS (for server-side API routes only)
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Alternative: Get user from Authorization header
export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: new Error('No authorization token') };
  }

  const token = authHeader.replace('Bearer ', '');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  
  return { user, error };
}

// Server-side profile functions (bypass RLS)
export const serverProfiles = {
  // Get profile by user ID
  getProfile: async (userId: string) => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    return { profile: data as Profile | null, error };
  },

  // Update profile (upsert - creates if doesn't exist)
  updateProfile: async (userId: string, updates: ProfileUpdate) => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates }, { onConflict: 'id' })
      .select()
      .single();
    
    return { profile: data as Profile | null, error };
  },

  // Check if username is available
  isUsernameAvailable: async (username: string, currentUserId?: string) => {
    const supabase = createAdminClient();
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username);
    
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }
    
    const { data, error } = await query;
    
    if (error) return { available: false, error };
    return { available: data.length === 0, error: null };
  },

  // Delete profile
  deleteProfile: async (userId: string) => {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    return { error };
  },
};


