import { useState } from 'react';
import Seo from '../../components/ui/Seo.jsx';
import Button from '../../components/ui/Button.jsx';
import { adminSnapshot, setStock, getHistory, resetInventory } from '../../services/inventory.js';

// NOTE: this is an architecture placeholder. Real admin access must be
// server-authenticated and role-gated, the passphrase here only keeps casual
// visitors out of the demo. The canonical admin tool is the Python CLI in
// /inventory; this view reads the same store shape.
const DEMO_PASS = 'azraa-admin';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('azraa.admin') === '1');
  const [pass, setPass] = useState('');
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  if (!authed) {
    return (
      <div className="u-wrap page-narrow admin-gate">
        <Seo title="Admin" />
        <h1 className="page-title">Administration</h1>
        <p className="muted">Inventory &amp; order oversight. Demo access only.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === DEMO_PASS) { sessionStorage.setItem('azraa.admin', '1'); setAuthed(true); }
          }}
          className="admin-gate__form"
        >
          <input className="input" type="password" placeholder="Passphrase" value={pass} onChange={(e) => setPass(e.target.value)} />
          <Button type="submit">Enter</Button>
        </form>
        <p className="checkout__fine">Demo passphrase: <code>{DEMO_PASS}</code>. In production this is server-authenticated.</p>
      </div>
    );
  }

  const snapshot = adminSnapshot();
  const history = getHistory(40);
  void tick;

  return (
    <div className="u-wrap page admin">
      <Seo title="Admin · Inventory" />
      <div className="account__head">
        <div>
          <span className="label">Admin</span>
          <h1 className="page-title">Inventory</h1>
        </div>
        <div className="row-gap" style={{ marginTop: 0 }}>
          <Button variant="ghost" size="sm" onClick={() => { resetInventory(); refresh(); }}>Reseed demo stock</Button>
          <Button variant="ghost" size="sm" onClick={() => { sessionStorage.removeItem('azraa.admin'); setAuthed(false); }}>Sign out</Button>
        </div>
      </div>

      <p className="muted" style={{ maxWidth: '46rem' }}>
        Product → colour → size → quantity. Customers only ever see In / Low / Out.
        The Python CLI in <code>/inventory</code> is the primary tool; edits here
        write to the same browser store for demoing.
      </p>

      <div className="admin__grid">
        {snapshot.map((p) => (
          <section className="admin__card" key={p.id}>
            <h2 className="admin__card-title">
              {p.name} <small>{p.category} · low ≤ {p.threshold}</small>
            </h2>
            <table className="admin__table">
              <thead><tr><th>Colour</th><th>Size</th><th>Qty</th><th>State</th><th /></tr></thead>
              <tbody>
                {p.variants.map((v) => (
                  <VariantRow key={`${v.color}-${v.size}`} productId={p.id} v={v} onSaved={refresh} />
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <section className="admin__history">
        <h2 className="checkout__h">Recent stock movements</h2>
        {history.length === 0 ? (
          <p className="muted">No movements yet.</p>
        ) : (
          <table className="admin__table">
            <thead><tr><th>When</th><th>Product</th><th>Variant</th><th>Δ</th><th>Reason</th><th>→</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{new Date(h.ts).toLocaleString()}</td>
                  <td>{h.productId}</td>
                  <td>{h.variantKey}</td>
                  <td className={h.delta < 0 ? 'admin__neg' : 'admin__pos'}>{h.delta > 0 ? `+${h.delta}` : h.delta}</td>
                  <td>{h.reason}{h.ref ? ` (${h.ref})` : ''}</td>
                  <td>{h.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function VariantRow({ productId, v, onSaved }) {
  const [val, setVal] = useState(v.qty);
  const dirty = Number(val) !== v.qty;
  return (
    <tr>
      <td>{v.color || 'N/A'}</td>
      <td>{v.size || 'N/A'}</td>
      <td>
        <input className="admin__qty" type="number" min="0" value={val} onChange={(e) => setVal(e.target.value)} />
      </td>
      <td><span className={`admin__state admin__state--${v.state}`}>{v.state}</span></td>
      <td>
        {dirty && (
          <button
            className="admin__save"
            onClick={() => { setStock(productId, v.color, v.size, Number(val)); onSaved(); }}
          >
            Save
          </button>
        )}
      </td>
    </tr>
  );
}
