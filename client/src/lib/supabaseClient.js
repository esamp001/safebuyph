import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
supabase.auth
  .getSession()
  .then(({ data: { session } }) => {
    console.log('Supabase connection successful!');
    console.log('Current session:', session);
  })
  .catch((error) => {
    console.error('Supabase connection error:', error);
  });
