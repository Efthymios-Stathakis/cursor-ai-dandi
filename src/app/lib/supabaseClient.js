import { createClient } from '@supabase/supabase-js';

// This client should only be used on the server side
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
  }
} else {
  console.warn('Supabase environment variables not set. Email authentication will not work.');
}

export { supabase }; 