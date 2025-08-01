import { supabase } from '../api/keys/supabase.js';

export async function createOrUpdateUser(userData) {
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error fetching user:', fetchError);
      throw fetchError;
    }

    if (existingUser) {
      // User exists, update their information
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          image: userData.image,
          updated_at: new Date().toISOString()
        })
        .eq('email', userData.email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      return { user: updatedUser, isNewUser: false };
    } else {
      // User doesn't exist, create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          image: userData.image,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw insertError;
      }

      return { user: newUser, isNewUser: true };
    }
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
} 