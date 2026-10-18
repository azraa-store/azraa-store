import { PASSWORD_RULES } from '../../utils/passwordPolicy.js';

export default function PasswordChecklist({ value }) {
  if (!value) return null;
  return (
    <ul className="pw-checklist">
      {PASSWORD_RULES.map((r) => {
        const met = r.test(value);
        return (
          <li key={r.id} className={met ? 'is-met' : ''}>
            <span aria-hidden="true">{met ? '✓' : '·'}</span> {r.label}
          </li>
        );
      })}
    </ul>
  );
}
