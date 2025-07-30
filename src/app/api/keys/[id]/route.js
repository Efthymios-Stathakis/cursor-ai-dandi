import { supabase } from '../supabase';

export async function PUT(req, { params }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  const { name } = await req.json();
  const { data, error } = await supabase
    .from('api_keys')
    .update({ name })
    .eq('id', parsedId)
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
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', parsedId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(null, { status: 204 });
} 