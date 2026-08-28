import { useId } from 'react';

export function Field({ label, hint, error, children, required, className = '' }) {
  const id = useId();
  const child =
    typeof children === 'function'
      ? children({ id, 'aria-describedby': hint ? `${id}-hint` : undefined })
      : children;
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="field__control">{child && cloneWithId(child, id)}</div>
      {hint && !error && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <p className="field__error">{error}</p>}
    </div>
  );
}

import { cloneElement, isValidElement } from 'react';
function cloneWithId(el, id) {
  if (isValidElement(el) && !el.props.id) return cloneElement(el, { id });
  return el;
}

export function TextInput(props) {
  return <input className="input" {...props} />;
}
export function Select({ children, ...props }) {
  return (
    <select className="input input--select" {...props}>
      {children}
    </select>
  );
}
export function TextArea(props) {
  return <textarea className="input input--area" rows={4} {...props} />;
}
