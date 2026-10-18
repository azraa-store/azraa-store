// Auth provider dispatcher: real Supabase Auth when VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY are configured, otherwise a localStorage mock so the
// full flow (including password reset) stays testable without credentials.
// Mirrors the services/payments/ provider-registry pattern. The interface
// here is what <AuthContext> depends on — keep ./auth/mock.js and
// ./auth/supabase.js in lockstep on function signatures and return shapes.

import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import * as mock from './auth/mock.js';
import * as real from './auth/supabase.js';

const impl = isSupabaseConfigured ? real : mock;

export const getSession = (...args) => impl.getSession(...args);
export const signUp = (...args) => impl.signUp(...args);
export const signIn = (...args) => impl.signIn(...args);
export const signOut = (...args) => impl.signOut(...args);
export const requestPasswordReset = (...args) => impl.requestPasswordReset(...args);
export const updateProfile = (...args) => impl.updateProfile(...args);
export const saveAddress = (...args) => impl.saveAddress(...args);
export const deleteAddress = (...args) => impl.deleteAddress(...args);
