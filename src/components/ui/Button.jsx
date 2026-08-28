import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * variant: 'primary' | 'outline' | 'ghost' | 'link'
 * size:    'sm' | 'md' | 'lg'
 * to -> react-router Link, href -> anchor, otherwise button
 */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, className = '', children, block, ...rest },
  ref
) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  );
});

export default Button;
