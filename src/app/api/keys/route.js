import { supabase } from './supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return Response.json(data);
}

export async function POST(req) {
  const { name, key } = await req.json();
  if (!name || !key) {
    return new Response(JSON.stringify({ error: 'Name and key are required.' }), { status: 400 });
  }
  // Check for duplicate name
  const { data: existing, error: checkError } = await supabase
    .from('api_keys')
    .select('id')
    .eq('name', name)
    .maybeSingle();
  if (checkError) {
    return new Response(JSON.stringify({ error: checkError.message }), { status: 500 });
  }
  if (existing) {
    return new Response(JSON.stringify({ error: 'API key already exists, please provide a different value.' }), { status: 409 });
  }
  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ name, key }])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return Response.json(data, { status: 201 });
} 