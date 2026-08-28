import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ResetPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await resetPassword(email);
    setBusy(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Reset password"
      intro={sent ? null : 'Enter your account email and we’ll send a reset link.'}
      alt={<>Remembered it? <Link to="/sign-in" className="link">Sign in</Link>.</>}
    >
      {sent ? (
        <p className="auth__ok">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={submit} className="auth__form">
          <Field label="Email" required>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Button type="submit" block disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
