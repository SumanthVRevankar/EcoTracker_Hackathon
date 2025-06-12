import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string
  email: string
  city: string
  created_at: string
  updated_at: string
}

export interface CarbonRecord {
  id: string
  user_id: string
  emission: number
  calculation_data: any
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  profiles: Profile
}

export interface PostLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface PostComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles: Profile
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  progress: number
  completed: boolean
  completed_at?: string
  started_at: string
}

export interface AIInsight {
  id: string
  user_id: string
  type: string
  title: string
  content: string
  priority: string
  category: string
  carbon_impact?: number
  read: boolean
  created_at: string
}