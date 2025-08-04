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

export async function getSessionFromToken(sessionToken) {
  if (!sessionToken || !supabase) {
    console.log('❌ No session token or Supabase not available');
    return null;
  }

  try {
    console.log('🔍 Looking up session token:', sessionToken);
    const { data: session, error } = await supabase
      .from('sessions')
      .select(`
        *,
        users (
          id,
          name,
          email,
          image
        )
      `)
      .eq('session_token', sessionToken)
      .gt('expires', new Date().toISOString())
      .single();

    if (error || !session) {
      console.log('❌ Session not found or expired:', error);
      return null;
    }

    console.log('✅ Session found for user:', session.users.email);
    return {
      user: session.users,
      sessionToken: session.session_token,
      expires: session.expires,
    };
  } catch (error) {
    console.error('❌ Error getting session:', error);
    return null;
  }
}

export async function createSession(userId) {
  if (!supabase) {
    console.error('❌ Supabase not available for session creation');
    return null;
  }

  try {
    console.log('🔑 Creating session for user ID:', userId);
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    console.log('📝 Inserting session into database...');
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        session_token: sessionToken,
        user_id: userId,
        expires: expires.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating session:', error);
      return null;
    }

    console.log('✅ Session created in database:', session.id);
    return {
      sessionToken,
      expires,
    };
  } catch (error) {
    console.error('❌ Error creating session:', error);
    return null;
  }
}

export async function deleteSession(sessionToken) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

export async function cleanupExpiredSessions() {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .lt('expires', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired sessions:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return false;
  }
} 