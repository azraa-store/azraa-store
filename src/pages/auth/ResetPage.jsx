import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import Turnstile, { isTurnstileConfigured } from '../../components/ui/Turnstile.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { verifyTurnstile } from '../../services/turnstile.js';

export default function ResetPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (isTurnstileConfigured) {
        const verified = await verifyTurnstile(turnstileToken);
        if (!verified) throw new Error('Verification failed. Please try the checkbox again.');
      }
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
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
          <Turnstile onVerify={setTurnstileToken} />
          {error && <p className="auth__error">{error}</p>}
          <Button type="submit" block disabled={busy || (isTurnstileConfigured && !turnstileToken)}>
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
