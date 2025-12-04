import { createClient } from '@supabase/supabase-js'
import { Profile, ProfileUpdate, CreateProfileData } from '@/types/profile'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Update last_login_at if sign in is successful
    if (data.user && !error) {
      await profiles.updateLastLogin(data.user.id)
    }
    
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile helper functions
export const profiles = {
  // Get profile by user ID
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    return { profile: data as Profile | null, error }
  },

  // Get profile by username
  getProfileByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
    
    return { profile: data as Profile | null, error }
  },

  // Create a new profile
  createProfile: async (profileData: CreateProfileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()
    
    return { profile: data as Profile | null, error }
  },

  // Update profile
  updateProfile: async (userId: string, updates: ProfileUpdate) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { profile: data as Profile | null, error }
  },

  // Update last login timestamp
  updateLastLogin: async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)
    
    return { error }
  },

  // Delete profile
  deleteProfile: async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    return { error }
  },

  // Check if username is available
  isUsernameAvailable: async (username: string, currentUserId?: string) => {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
    
    // If checking for current user, exclude their ID
    if (currentUserId) {
      query = query.neq('id', currentUserId)
    }
    
    const { data, error } = await query
    
    if (error) return { available: false, error }
    return { available: data.length === 0, error: null }
  },

  // Upload avatar
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      return { avatarUrl: null, error: uploadError }
    }

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    return { avatarUrl: data.publicUrl, error: null }
  },

  // Delete avatar
  deleteAvatar: async (avatarUrl: string) => {
    // Extract file path from URL
    const filePath = avatarUrl.split('/').slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from('profiles')
      .remove([filePath])
    
    return { error }
  }
} 