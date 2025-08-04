import { supabase } from '../supabase';
import { requireAuth } from '../../../lib/auth.js';

export async function PUT(req, { params }) {
  const authResult = await requireAuth();
  
  if (authResult.error) {
    return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
  }
  
  const { user } = authResult;
  const { id } = await params;
  const { name } = await req.json();
  
  // First check if the API key belongs to the authenticated user
  const { data: existingKey, error: checkError } = await supabase
    .from('api_keys')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
    
  if (checkError || !existingKey) {
    return new Response(JSON.stringify({ error: 'API key not found or access denied.' }), { status: 404 });
  }
  
  const { data, error } = await supabase
    .from('api_keys')
    .update({ name })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  if (!data) {
    return new Response(JSON.stringify({ error: 'API key not found.' }), { status: 404 });
  }
  return Response.json(data);
}

export async function DELETE(req, { params }) {
  const authResult = await requireAuth();
  
  if (authResult.error) {
    return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
  }
  
  const { user } = authResult;
  const { id } = await params;
  
  // First check if the API key belongs to the authenticated user
  const { data: existingKey, error: checkError } = await supabase
    .from('api_keys')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
    
  if (checkError || !existingKey) {
    return new Response(JSON.stringify({ error: 'API key not found or access denied.' }), { status: 404 });
  }
  
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(null, { status: 204 });
} 