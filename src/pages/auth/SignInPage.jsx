import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(form);
      navigate(state?.from || '/account');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      intro="Access your orders, saved addresses and account pricing."
      alt={<>New to AZRAA? <Link to="/sign-up" className="link">Create an account</Link>.</>}
    >
      <form onSubmit={submit} className="auth__form">
        <Field label="Email" required>
          <TextInput type="email" autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Password" required>
          <TextInput type="password" autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </Field>
        {error && <p className="auth__error">{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
        <Link to="/reset-password" className="auth__minor">Forgot your password?</Link>
      </form>
    </AuthLayout>
  );
}
