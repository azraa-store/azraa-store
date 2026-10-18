import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js';

/**
 * Landing page for the link in the password-reset email (requestPasswordReset
 * sets redirectTo to /reset-password/confirm). Supabase's client detects the
 * recovery token in the URL on load and establishes a temporary session, so
 * this page only needs to collect the new password and call updateUser.
 */
export default function ResetConfirmPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Password reset links only work once Supabase is configured.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/account'), 1500);
  };

  return (
    <AuthLayout title="Set a new password" intro={done ? null : 'Choose a new password for your account.'}>
      {done ? (
        <p className="auth__ok">Password updated. Taking you to your account.</p>
      ) : (
        <form onSubmit={submit} className="auth__form">
          <Field label="New password" hint="At least 8 characters." required>
            <TextInput type="password" autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error && <p className="auth__error">{error}</p>}
          <Button type="submit" block disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
