
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL; // Your Supabase project URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Your Supabase anon key

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
