import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../services/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await auth.getSession();
    setUser(s);
    return s;
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: Boolean(user),
      async signIn(creds) {
        const u = await auth.signIn(creds);
        setUser(u);
        return u;
      },
      async signUp(data) {
        const u = await auth.signUp(data);
        setUser(u);
        return u;
      },
      async signOut() {
        await auth.signOut();
        setUser(null);
      },
      resetPassword: auth.requestPasswordReset,
      async updateProfile(patch) {
        const u = await auth.updateProfile(patch);
        setUser(u);
        return u;
      },
      async saveAddress(a) {
        const u = await auth.saveAddress(a);
        setUser(u);
        return u;
      },
      async deleteAddress(id) {
        const u = await auth.deleteAddress(id);
        setUser(u);
        return u;
      },
      refresh,
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
