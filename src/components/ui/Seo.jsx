import { useEffect } from 'react';

/** Minimal document head management, title + description, no dependency. */
export default function Seo({ title, description }) {
  useEffect(() => {
    const full = title ? `${title}, AZRAA` : 'AZRAA, Wholesale & Retail across Asia and Africa';
    document.title = full;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
  return null;
}
