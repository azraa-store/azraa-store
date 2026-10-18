import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignInPage() {
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [mode, setMode] = useState('password'); // 'password' | 'magic'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'magic') {
        await signInWithMagicLink(form.email);
        setMagicSent(true);
        setBusy(false);
      } else {
        await signIn(form);
        navigate(state?.from || '/account');
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setMagicSent(false);
  };

  return (
    <AuthLayout
      title="Sign in"
      intro={magicSent ? null : 'Access your orders, saved addresses and account pricing.'}
      alt={magicSent ? null : <>New to AZRAA? <Link to="/sign-up" className="link">Create an account</Link>.</>}
    >
      {magicSent ? (
        <p className="auth__ok">
          Check <strong>{form.email}</strong> for a link to sign in, no password needed.
        </p>
      ) : (
        <form onSubmit={submit} className="auth__form">
          <Field label="Email" required>
            <TextInput type="email" autoComplete="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          {mode === 'password' && (
            <Field label="Password" required>
              <TextInput type="password" autoComplete="current-password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </Field>
          )}
          {error && <p className="auth__error">{error}</p>}
          <Button type="submit" block disabled={busy}>
            {busy ? (mode === 'magic' ? 'Sending…' : 'Signing in…') : (mode === 'magic' ? 'Email me a sign-in link' : 'Sign in')}
          </Button>
          {mode === 'password' ? (
            <>
              <Link to="/reset-password" className="auth__minor">Forgot your password?</Link>
              <button type="button" className="link auth__minor" onClick={() => switchMode('magic')}>
                Sign in with a magic link instead
              </button>
            </>
          ) : (
            <button type="button" className="link auth__minor" onClick={() => switchMode('password')}>
              Use a password instead
            </button>
          )}
        </form>
      )}
    </AuthLayout>
  );
}
