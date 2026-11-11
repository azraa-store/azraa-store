import { useState } from 'react';
import Button from './Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function GoogleButton({ label = 'Continue with Google', onError }) {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);

  const click = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      // On success the page navigates to Google; it never reaches here.
    } catch (err) {
      setBusy(false);
      onError?.(err.message);
    }
  };

  return (
    <Button type="button" variant="outline" block className="btn--google" onClick={click} disabled={busy}>
      <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M45.1 24.5c0-1.6-.15-3.1-.42-4.6H24v8.7h11.8c-.5 2.8-2.05 5.1-4.4 6.7v5.5h7.1c4.15-3.8 6.6-9.5 6.6-16.3Z" />
        <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.2l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.4 46 24 46Z" />
        <path fill="#FBBC05" d="M11.8 28.4c-.45-1.3-.7-2.7-.7-4.4s.25-3.1.7-4.4v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.85 6.9 2.5 9.8l7.3-5.4Z" />
        <path fill="#EA4335" d="M24 10.4c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 3.9 29.9 2 24 2 15.4 2 8.1 7 4.5 14.2l7.3 5.7c1.7-5.2 6.5-9 12.2-9Z" />
      </svg>
      {busy ? 'Redirecting…' : label}
    </Button>
  );
}
