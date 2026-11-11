// Order persistence dispatcher: real Supabase (supabase/schema.sql's
// `orders` table) when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are
// configured, otherwise a localStorage mock. Mirrors the services/auth.js
// and services/payments/ provider-registry pattern. Previously orders only
// ever lived in localStorage regardless of Supabase config — this is what
// makes order history real and cross-device once the migration is run.

import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import * as mock from './orders/mock.js';
import * as real from './orders/supabase.js';

const impl = isSupabaseConfigured ? real : mock;

export const createOrder = (...args) => impl.createOrder(...args);
export const cancelOrder = (...args) => impl.cancelOrder(...args);
export const listOrders = (...args) => impl.listOrders(...args);
export const getOrder = (...args) => impl.getOrder(...args);
