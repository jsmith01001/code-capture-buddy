import { createClient } from '@supabase/supabase-js'

// Get these values from your Supabase project settings
const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'

// Temporary fallback for development - replace with actual values
if (!supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co') {
  console.error('Please update src/lib/supabase.ts with your actual Supabase URL and anon key')
  throw new Error('Supabase configuration missing. Please check your project settings.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)