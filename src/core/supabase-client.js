import { createClient } from '@supabase/supabase-js';

let supabase = null;

/**
 * Initializes or resets the Supabase client using stored credentials.
 */
export function initSupabase(url, anonKey) {
  if (!url || !anonKey) {
    supabase = null;
    return null;
  }

  try {
    supabase = createClient(url, anonKey);
    return supabase;
  } catch (err) {
    console.warn('Gagal inisialisasi Supabase client:', err.message);
    supabase = null;
    return null;
  }
}

/**
 * Checks if Supabase client is active.
 */
export function isSupabaseActive() {
  return supabase !== null;
}

/**
 * Uploads/syncs a story item to Supabase database (`stories` table).
 */
export async function syncStoryToSupabase(story) {
  if (!supabase) return { success: false, reason: 'Supabase tidak dikonfigurasi' };

  try {
    const payload = {
      id: story.id,
      created_at: new Date(story.createdAt || Date.now()).toISOString(),
      updated_at: new Date(story.updatedAt || Date.now()).toISOString(),
      title: story.title,
      story: story.story,
      mode: story.mode || 'Otomatis',
      theme: story.theme || '',
      idea: story.idea || '',
      outline: typeof story.outline === 'object' ? JSON.stringify(story.outline) : (story.outline || ''),
      image_prompt: story.imagePrompt || '',
      image_url: story.imageData || story.imageURL || '',
      feedback: story.feedback || ''
    };

    const { data, error } = await supabase
      .from('stories')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error syncing story to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches all saved stories from Supabase database (`stories` table).
 */
export async function fetchStoriesFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform back to app format
    return data.map(item => ({
      id: item.id,
      createdAt: new Date(item.created_at).getTime(),
      updatedAt: new Date(item.updated_at).getTime(),
      title: item.title,
      story: item.story,
      mode: item.mode,
      theme: item.theme,
      idea: item.idea,
      outline: item.outline ? (typeof item.outline === 'string' ? safeParse(item.outline) : item.outline) : null,
      imagePrompt: item.image_prompt,
      imageData: item.image_url,
      feedback: item.feedback
    }));
  } catch (err) {
    console.error('Error fetching stories from Supabase:', err.message);
    return null;
  }
}

/**
 * Deletes a story from Supabase database (`stories` table).
 */
export async function deleteStoryFromSupabase(id) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting story from Supabase:', err.message);
    return false;
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
