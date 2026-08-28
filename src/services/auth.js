// Mock authentication. Persists to localStorage. The interface (async, tokenless
// here) mirrors what a real endpoint would expose so <AuthContext> is unchanged
// when this is swapped for `/api/auth/*`.
//
// Passwords are stored only for this local demo and are lightly obfuscated, not
// secured. Do NOT reuse this approach against a real backend.

const USERS_KEY = 'azraa.users';
const SESSION_KEY = 'azraa.session';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const obf = (s) => btoa(unescape(encodeURIComponent(s))).split('').reverse().join('');

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}
function writeUsers(u) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  } catch {
    /* ignore */
  }
}

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

export async function getSession() {
  await delay(0);
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const users = readUsers();
    return users[email] ? publicUser(users[email]) : null;
  } catch {
    return null;
  }
}

export async function signUp({ name, email, password }) {
  await delay(500);
  email = email.trim().toLowerCase();
  if (!name || !email || !password) throw new Error('All fields are required.');
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');
  const users = readUsers();
  if (users[email]) throw new Error('An account with this email already exists.');
  users[email] = {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    name: name.trim(),
    email,
    password: obf(password),
    createdAt: new Date().toISOString(),
    addresses: [],
    account: { phone: '', company: '', marketingOptIn: false },
  };
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, email);
  return publicUser(users[email]);
}

export async function signIn({ email, password }) {
  await delay(450);
  email = email.trim().toLowerCase();
  const users = readUsers();
  const u = users[email];
  if (!u || u.password !== obf(password)) throw new Error('Email or password is incorrect.');
  localStorage.setItem(SESSION_KEY, email);
  return publicUser(u);
}

export async function signOut() {
  await delay(150);
  localStorage.removeItem(SESSION_KEY);
}

export async function requestPasswordReset(email) {
  await delay(600);
  // A real backend emails a link. Here we just acknowledge.
  return { ok: true, email: email.trim().toLowerCase() };
}

export async function updateProfile(patch) {
  await delay(400);
  const email = localStorage.getItem(SESSION_KEY);
  const users = readUsers();
  if (!email || !users[email]) throw new Error('Not signed in.');
  users[email] = {
    ...users[email],
    ...('name' in patch ? { name: patch.name } : {}),
    account: { ...users[email].account, ...(patch.account || {}) },
  };
  writeUsers(users);
  return publicUser(users[email]);
}

export async function saveAddress(address) {
  await delay(350);
  const email = localStorage.getItem(SESSION_KEY);
  const users = readUsers();
  if (!email || !users[email]) throw new Error('Not signed in.');
  const list = users[email].addresses || [];
  if (address.id) {
    users[email].addresses = list.map((a) => (a.id === address.id ? address : a));
  } else {
    users[email].addresses = [
      ...list,
      { ...address, id: `adr_${Math.random().toString(36).slice(2, 9)}` },
    ];
  }
  writeUsers(users);
  return publicUser(users[email]);
}

export async function deleteAddress(id) {
  await delay(250);
  const email = localStorage.getItem(SESSION_KEY);
  const users = readUsers();
  if (!email || !users[email]) throw new Error('Not signed in.');
  users[email].addresses = (users[email].addresses || []).filter((a) => a.id !== id);
  writeUsers(users);
  return publicUser(users[email]);
}
