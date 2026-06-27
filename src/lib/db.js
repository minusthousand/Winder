import { supabase } from './supabase';

function toProfile(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    likesYou: row.likes_you,
    job: row.job,
    location: row.location,
    distance: row.distance,
    bio: row.bio,
    interests: row.interests || [],
    images: row.images || [],
  };
}

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map(toProfile);
}

export async function insertProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      name: profile.name,
      age: profile.age,
      likes_you: profile.likesYou ?? true,
      job: profile.job,
      location: profile.location,
      distance: profile.distance,
      bio: profile.bio,
      interests: profile.interests,
      images: profile.images,
    })
    .select()
    .single();
  if (error) throw error;
  return toProfile(data);
}

export async function seedProfiles(seeds) {
  const rows = seeds.map((p) => ({
    name: p.name,
    age: p.age,
    likes_you: p.likesYou,
    job: p.job,
    location: p.location,
    distance: p.distance,
    bio: p.bio,
    interests: p.interests,
    images: p.images,
  }));
  const { data, error } = await supabase.from('profiles').insert(rows).select();
  if (error) throw error;
  return data.map(toProfile);
}
