import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signUp(form);
      navigate('/account');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      intro="For faster checkout, order history, and — once approved — wholesale account pricing."
      alt={<>Already have an account? <Link to="/sign-in" className="link">Sign in</Link>.</>}
    >
      <form onSubmit={submit} className="auth__form">
        <Field label="Full name" required>
          <TextInput autoComplete="name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Email" required>
          <TextInput type="email" autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Password" hint="At least 8 characters." required>
          <TextInput type="password" autoComplete="new-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </Field>
        {error && <p className="auth__error">{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Creating…' : 'Create account'}</Button>
        <p className="auth__minor">
          By creating an account you agree to our <Link to="/legal/terms" className="link">terms</Link>{' '}
          and <Link to="/legal/privacy" className="link">privacy policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
