import { useState } from 'react';
import Seo from '../components/ui/Seo.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, TextInput, TextArea, Select } from '../components/ui/Field.jsx';
import { WHATSAPP, whatsappLink } from '../config/site.js';

const TOPICS = ['Wholesale enquiry', 'An existing order', 'Product question', 'Partnership', 'Something else'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [sent, setSent] = useState(false);

  return (
    <div className="u-wrap page contact-page">
      <Seo title="Contact" description="Contact AZRAA — wholesale, orders and general enquiries." />
      <span className="label">Contact</span>
      <h1 className="page-title">Get in touch</h1>

      <div className="contact-grid">
        <div className="contact-info">
          <div>
            <h3>WhatsApp</h3>
            <p className="muted">Quickest for quotes, stock and order questions.</p>
            <p>
              <a
                className="link"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {WHATSAPP.display}
              </a>
            </p>
          </div>
          <div>
            <h3>Wholesale desk</h3>
            <p className="muted">Trade enquiries, quotes and account terms.</p>
            <p>Use the <a className="link" href="/wholesale/enquiry">wholesale enquiry form</a> for the fastest response. Direct line and email to be listed.</p>
          </div>
          <div>
            <h3>Customer care</h3>
            <p className="muted">Orders, delivery and returns.</p>
            <p>Email and hours to be listed. Reference your order number for anything order-related.</p>
          </div>
          <div>
            <h3>Head office</h3>
            <p className="muted">Registered address to follow.</p>
            <p>Operating across India and Nigeria, shipping across Asia and Africa.</p>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          {sent ? (
            <p className="auth__ok">Thank you — we’ve received your message and will reply to {form.email}.</p>
          ) : (
            <>
              <div className="field-row">
                <Field label="Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
                <Field label="Email" required><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
              </div>
              <Field label="Topic">
                <Select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Message" required>
                <TextArea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </Field>
              <Button type="submit">Send message</Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
