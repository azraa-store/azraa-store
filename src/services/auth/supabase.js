// Real authentication via Supabase Auth, used when VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY are set (see src/lib/supabaseClient.js). Mirrors the
// exact function signatures of ./mock.js so src/services/auth.js can
// dispatch between the two transparently.
//
// Schema: supabase/schema.sql (profiles + addresses tables, RLS policies,
// and the trigger that creates a profiles row on sign-up), run once in the
// Supabase SQL editor before this backend will work.

import { supabase } from '../../lib/supabaseClient.js';
import { isPasswordValid } from '../../utils/passwordPolicy.js';

function mapAuthError(error) {
  const msg = error?.message || 'Something went wrong.';
  if (/already registered|already exists/i.test(msg)) return 'An account with this email already exists.';
  if (/invalid login credentials/i.test(msg)) return 'Email or password is incorrect.';
  if (/password.*(6|8).*character/i.test(msg)) return 'Password must be at least 8 characters.';
  return msg;
}

async function loadProfile(authUser) {
  if (!authUser) return null;
  const [{ data: profile }, { data: addresses }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
    supabase.from('addresses').select('*').eq('user_id', authUser.id).order('created_at', { ascending: true }),
  ]);
  return {
    id: authUser.id,
    name: profile?.name || authUser.user_metadata?.name || '',
    email: authUser.email,
    createdAt: authUser.created_at,
    addresses: (addresses || []).map((a) => ({
      id: a.id,
      name: a.name || '',
      line1: a.line1,
      line2: a.line2 || '',
      city: a.city,
      state: a.state || '',
      postcode: a.postcode || '',
      phone: a.phone || '',
    })),
    account: {
      phone: profile?.phone || '',
      company: profile?.company || '',
      marketingOptIn: Boolean(profile?.marketing_opt_in),
    },
  };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? loadProfile(session.user) : null;
}

export async function signUp({ name, email, password, phone }) {
  if (!name || !email || !password || !phone) throw new Error('All fields are required.');
  if (!isPasswordValid(password)) throw new Error('Password must be at least 8 characters, with upper and lower case, a number and a symbol.');
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name: name.trim(), phone } },
  });
  if (error) throw new Error(mapAuthError(error));
  if (!data.session) return { user: null, needsConfirmation: true };
  return { user: await loadProfile(data.user), needsConfirmation: false };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw new Error(mapAuthError(error));
  return loadProfile(data.user);
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email) {
  const trimmed = email.trim().toLowerCase();
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: `${window.location.origin}/reset-password/confirm`,
  });
  if (error) throw new Error(mapAuthError(error));
  return { ok: true, email: trimmed };
}

export async function signInWithMagicLink(email) {
  const trimmed = email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: { emailRedirectTo: `${window.location.origin}/account` },
  });
  if (error) throw new Error(mapAuthError(error));
  return { ok: true, email: trimmed };
}

// Reauthenticates by re-verifying the current password (rather than
// Supabase's nonce-based reauthenticate() flow) before changing the login
// email. updateUser({ email }) doesn't take effect until the confirmation
// link is clicked — with "Secure email change" on, Supabase sends that link
// to both the old and new address.
export async function changeEmail({ newEmail, currentPassword }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (reauthError) throw new Error('Current password is incorrect.');
  const { error } = await supabase.auth.updateUser({ email: newEmail.trim().toLowerCase() });
  if (error) throw new Error(mapAuthError(error));
  return { ok: true };
}

export async function updateProfile(patch) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const updates = {};
  if ('name' in patch) updates.name = patch.name;
  if (patch.account) {
    if ('phone' in patch.account) updates.phone = patch.account.phone;
    if ('company' in patch.account) updates.company = patch.account.company;
    if ('marketingOptIn' in patch.account) updates.marketing_opt_in = patch.account.marketingOptIn;
  }
  if (Object.keys(updates).length) {
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) throw new Error(error.message);
  }
  return loadProfile(user);
}

export async function saveAddress(address) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const row = {
    user_id: user.id,
    name: address.name,
    line1: address.line1,
    line2: address.line2 || null,
    city: address.city,
    state: address.state || null,
    postcode: address.postcode || null,
    phone: address.phone || null,
  };
  if (address.id) {
    const { error } = await supabase.from('addresses').update(row).eq('id', address.id).eq('user_id', user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('addresses').insert(row);
    if (error) throw new Error(error.message);
  }
  return loadProfile(user);
}

export async function deleteAddress(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
  return loadProfile(user);
}
