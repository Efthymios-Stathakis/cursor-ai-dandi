import { supabase } from './supabase';
import { requireAuth } from '../../lib/auth.js';

export async function GET() {
  const authResult = await requireAuth();
  
  if (authResult.error) {
    return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
  }
  
  const { user } = authResult;
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return Response.json(data);
}

export async function POST(req) {
  const authResult = await requireAuth();
  
  if (authResult.error) {
    return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
  }
  
  const { user } = authResult;
  const { name, key } = await req.json();
  
  if (!name || !key) {
    return new Response(JSON.stringify({ error: 'Name and key are required.' }), { status: 400 });
  }
  
  // Check for duplicate name for this specific user
  const { data: existing, error: checkError } = await supabase
    .from('api_keys')
    .select('id')
    .eq('name', name)
    .eq('user_id', user.id)
    .maybeSingle();
  if (checkError) {
    return new Response(JSON.stringify({ error: checkError.message }), { status: 500 });
  }
  if (existing) {
    return new Response(JSON.stringify({ error: 'API key already exists, please provide a different value.' }), { status: 409 });
  }
  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ name, key, user_id: user.id }])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return Response.json(data, { status: 201 });
} 