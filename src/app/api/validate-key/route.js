import { supabase } from '../keys/supabase';

export async function POST(req) {
  try {
    const { key } = await req.json();
    
    if (!key) {
      return new Response(JSON.stringify({ valid: false, error: 'API key is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ valid: false, error: 'Database error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If data exists, the key is valid
    const isValid = !!data;

    return new Response(JSON.stringify({ valid: isValid }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return new Response(JSON.stringify({ valid: false, error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 