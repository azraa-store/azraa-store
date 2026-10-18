import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, TextInput } from '../../components/ui/Field.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useRegion } from '../../context/RegionContext.jsx';
import { listOrders, cancelOrder } from '../../services/orders.js';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="u-wrap page-narrow"><p className="muted">Loading…</p></div>;
  if (!user) return <Navigate to="/sign-in" replace state={{ from: '/account' }} />;

  const links = [
    ['', 'Overview'],
    ['orders', 'Orders'],
    ['addresses', 'Addresses'],
    ['profile', 'Profile'],
  ];

  return (
    <div className="u-wrap page account">
      <Seo title="Your account" />
      <div className="account__head">
        <div>
          <span className="label">Account</span>
          <h1 className="page-title">{user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate('/'); }}>
          Sign out
        </Button>
      </div>

      <div className="account__grid">
        <nav className="account__nav" aria-label="Account">
          {links.map(([to, label]) => (
            <NavLink key={to} to={`/account/${to}`} end className={({ isActive }) => `account__link ${isActive ? 'is-active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="account__panel">
          <Routes>
            <Route index element={<Overview user={user} />} />
            <Route path="orders" element={<Orders user={user} />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/account" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview({ user }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => { listOrders({ email: user.email }).then(setOrders); }, [user.email]);
  return (
    <div className="acct-view">
      <h2 className="checkout__h">Overview</h2>
      <div className="acct-cards">
        <div className="acct-card">
          <span className="acct-card__n">{orders.length}</span>
          <span className="acct-card__l">Orders placed</span>
          <Link to="/account/orders" className="link">View orders</Link>
        </div>
        <div className="acct-card">
          <span className="acct-card__n">{user.addresses?.length || 0}</span>
          <span className="acct-card__l">Saved addresses</span>
          <Link to="/account/addresses" className="link">Manage</Link>
        </div>
        <div className="acct-card">
          <span className="acct-card__n">N/A</span>
          <span className="acct-card__l">Wholesale account</span>
          <Link to="/wholesale/enquiry" className="link">Apply</Link>
        </div>
      </div>
      <p className="muted">
        Wholesale account pricing, terms and repeat ordering appear here once your
        trade account is approved.
      </p>
    </div>
  );
}

function Orders({ user }) {
  const [orders, setOrders] = useState(null);
  const [busy, setBusy] = useState(null);
  const refresh = () => listOrders({ email: user.email }).then(setOrders);
  useEffect(() => { refresh(); }, [user.email]);

  const cancel = async (id) => {
    setBusy(id);
    await cancelOrder(id); // restores inventory
    await refresh();
    setBusy(null);
  };

  if (!orders) return <p className="muted">Loading…</p>;
  if (orders.length === 0) {
    return (
      <div className="acct-view">
        <h2 className="checkout__h">Orders</h2>
        <p className="muted">No orders yet.</p>
        <Button to="/shop" variant="outline" size="sm">Start shopping</Button>
      </div>
    );
  }
  return (
    <div className="acct-view">
      <h2 className="checkout__h">Orders</h2>
      <div className="acct-orders">
        {orders.map((o) => (
          <div className="acct-order" key={o.id}>
            <div>
              <Link to={`/order/${o.id}`} className="acct-order__num">{o.number}</Link>
              <span className="acct-order__date">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="acct-order__items">{o.items.reduce((n, i) => n + i.qty, 0)} items · {o.orderType || 'retail'}</span>
            <span className="acct-order__total">{o.display?.total || 'N/A'}</span>
            <span className={`acct-order__status acct-order__status--${o.status}`}>{o.status}</span>
            {o.status === 'confirmed' && (
              <button className="acct-order__cancel" disabled={busy === o.id} onClick={() => cancel(o.id)}>
                {busy === o.id ? 'Cancelling…' : 'Cancel'}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
        Cancelling a confirmed order returns its items to stock.
      </p>
    </div>
  );
}

function Addresses() {
  const { user, saveAddress, deleteAddress } = useAuth();
  const empty = { name: '', line1: '', line2: '', city: '', state: '', postcode: '', phone: '' };
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    await saveAddress(draft);
    setDraft(empty);
    setBusy(false);
  };

  return (
    <div className="acct-view">
      <h2 className="checkout__h">Addresses</h2>
      {(user.addresses || []).length > 0 && (
        <div className="acct-addr-list">
          {user.addresses.map((a) => (
            <div className="acct-addr" key={a.id}>
              <p>
                <strong>{a.name}</strong><br />
                {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                {a.city}{a.postcode ? ` ${a.postcode}` : ''}<br />
                {a.phone}
              </p>
              <button className="link" onClick={() => deleteAddress(a.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={add} className="acct-form">
        <h3 className="acct-form__h">Add an address</h3>
        <Field label="Full name" required><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required /></Field>
        <Field label="Address line 1" required><TextInput value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} required /></Field>
        <Field label="Address line 2"><TextInput value={draft.line2} onChange={(e) => setDraft({ ...draft, line2: e.target.value })} /></Field>
        <div className="field-row">
          <Field label="City" required><TextInput value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} required /></Field>
          <Field label="Postcode / PIN"><TextInput value={draft.postcode} onChange={(e) => setDraft({ ...draft, postcode: e.target.value })} /></Field>
        </div>
        <Field label="Phone" required><TextInput value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} required /></Field>
        <Button type="submit" size="sm" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</Button>
      </form>
    </div>
  );
}

function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.account?.phone || '',
    company: user.account?.company || '',
  });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await updateProfile({ name: form.name, account: { phone: form.phone, company: form.company } });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="acct-view">
      <h2 className="checkout__h">Profile</h2>
      <form onSubmit={submit} className="acct-form">
        <Field label="Full name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <Field label="Email"><TextInput value={user.email} disabled /></Field>
        <Field label="Phone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Company (for wholesale)"><TextInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
        <Button type="submit" size="sm" disabled={busy}>{busy ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}</Button>
      </form>
      <ChangeEmail />
    </div>
  );
}

function ChangeEmail() {
  const { changeEmail } = useAuth();
  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await changeEmail(form);
      setSent(true);
      setForm({ newEmail: '', currentPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="acct-form">
      <h3 className="acct-form__h">Change email address</h3>
      {sent ? (
        <p className="auth__ok">
          Check your inbox to confirm the change. Your current email stays active until you do.
        </p>
      ) : (
        <>
          <Field label="New email address" required>
            <TextInput type="email" autoComplete="email" value={form.newEmail}
              onChange={(e) => setForm({ ...form, newEmail: e.target.value })} required />
          </Field>
          <Field label="Current password" hint="Confirms it's really you." required>
            <TextInput type="password" autoComplete="current-password" value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required />
          </Field>
          {error && <p className="auth__error">{error}</p>}
          <Button type="submit" size="sm" disabled={busy}>{busy ? 'Updating…' : 'Update email'}</Button>
        </>
      )}
    </form>
  );
}
