<<<<<<< Updated upstream
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
=======
// Mock Supabase client - returns null to disable Supabase features
export const supabase = null;
export const isSupabaseAvailable = () => false;
>>>>>>> Stashed changes
