// AZRAA Bot — the assistant engine.
//
// Two modes, chosen at runtime:
//
//   1. REAL MODEL (production) — if `VITE_ASSISTANT_ENDPOINT` is set, every turn
//      is POSTed to that backend, which runs the conversation against Claude
//      (e.g. `claude-opus-5`) with a system prompt + the live catalogue as
//      context/tools, and returns the shaped reply below. The model key and the
//      prompt live server-side — never in the browser. Backend contract:
//
//        POST <VITE_ASSISTANT_ENDPOINT>
//        body:  { messages: [{role,content}], context: {...} }
//        200:   { content: string, chips?: [{label,send}],
//                 products?: [slug], links?: [{label,to}], handoff?: boolean }
//
//   2. LOCAL KNOWLEDGE ENGINE (default / offline) — answers from the site's own
//      data: the product catalogue, categories, pricing (region-aware), live
//      inventory, logistics and a curated FAQ set. No network, no key.
//
// The UI only ever calls `askAssistant()` and renders the shaped reply, so
// swapping in the backend is a one-line env change with no UI work.

import { PRODUCTS } from '../data/products.js';
import { activeCategories, getCategory } from '../data/categories.js';
import { FAQS } from '../data/faqs.js';
import { resolvePrice } from './pricing.js';
import { availability, availabilityLabel } from './inventory.js';

const ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT || '';

/* ────────────────────────────  public API  ──────────────────────────── */

export const assistantMode = ENDPOINT ? 'model' : 'local';

/**
 * @param {{ messages: {role:string,content:string}[], context: object }} args
 * @returns {Promise<AssistantReply>}
 */
export async function askAssistant({ messages, context = {} }) {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  const text = (last?.content || '').trim();

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context }),
      });
      if (!res.ok) throw new Error(`assistant endpoint ${res.status}`);
      const data = await res.json();
      return normalise(data);
    } catch (err) {
      // fall through to the local engine so the bot never goes dark
      console.warn('[AZRAA Bot] endpoint unavailable, using local engine:', err.message);
    }
  }

  await wait(360 + Math.random() * 420); // a natural beat before replying
  return normalise(localAnswer(text, context));
}

/** Opening message when the panel is first opened. */
export function greeting(context = {}) {
  const region = context.country ? ` You're shopping in ${context.country}.` : '';
  return normalise({
    content:
      `Hi, I'm AZRAA Bot — your shopping assistant.${region} I can help you find products, check pricing and stock, explain wholesale and delivery, or point you to the right page. What are you after?`,
    chips: [
      { label: 'Browse the range', send: 'What do you sell?' },
      { label: 'How does wholesale work?', send: 'How does wholesale work?' },
      { label: 'Delivery & returns', send: 'Tell me about delivery and returns' },
      { label: 'Talk to a person', send: 'I want to talk to a person' },
    ],
  });
}

/* ────────────────────────────  local engine  ──────────────────────────── */

/** @returns {AssistantReply} */
function localAnswer(raw, context) {
  const text = raw.toLowerCase();
  if (!text) {
    return { content: 'Ask me anything about AZRAA products, pricing, orders or delivery.' };
  }

  // 1 — greetings / thanks / identity
  if (/^(hi|hey|hello|yo|good (morning|afternoon|evening)|howdy)\b/.test(text)) {
    return {
      content: "Hello. What can I help you with — finding a product, pricing, wholesale, or an order?",
      chips: quickStart(),
    };
  }
  if (/\b(thanks|thank you|cheers|appreciate)\b/.test(text)) {
    return { content: "Anytime. Anything else I can help with?", chips: quickStart() };
  }
  if (/\b(who are you|what are you|your name|azraa bot)\b/.test(text)) {
    return faqReply(byId('company'));
  }

  // 2 — human handoff
  if (/\b(human|real person|agent|talk to (a )?(person|someone|human)|speak to|customer (service|care|support)|complain)\b/.test(text)
      || /\bwhatsapp\b/.test(text)) {
    return { ...faqReply(byId('contact-human')), handoff: true };
  }

  // 3 — pricing / cost, optionally about a specific product
  if (/\b(price|cost|how much|pricing|rate|expensive|cheap|\$|₹|rupee|dollar)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) return priceReply(hits[0], context);
    if (hits.length > 1) {
      return {
        content: `Here's pricing for the closest matches — open one for the full breakdown.`,
        products: hits.slice(0, 4).map((p) => productCard(p, context)),
      };
    }
    return {
      content:
        `Every product has a retail price and a lower wholesale price (with a minimum quantity). Prices show in your selected currency. Tell me which product and I'll give you the exact figures.`,
      chips: productChips(),
    };
  }

  // 4 — wholesale / MOQ
  if (/\b(wholesale|bulk|moq|minimum order|minimum quantity|reseller|distribut|trade account|buy in bulk|per unit|unit price)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) return priceReply(hits[0], context, { lead: 'wholesale' });
    if (/\b(moq|minimum (order|quantit)|smallest order|how (many|much).*(minimum|least)|pack size)\b/.test(text)) {
      return moqReply();
    }
    return faqReply(byId(/trade account|net terms|credit/.test(text) ? 'trade-account' : 'wholesale-how'));
  }

  // 5 — stock / availability
  if (/\b(in stock|out of stock|stock|available|availability|sold out|restock)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) {
      const p = hits[0];
      return {
        content: `${p.name} — ${availabilityLabel(availability(p)) || 'availability on request'}. Stock is shown live on the product page and updates as orders come in.`,
        products: [productCard(p, context)],
      };
    }
    if (hits.length > 1) return stockReply(hits.slice(0, 4));
    return faqReply(byId('stock'));
  }

  // 6 — sizing / fit
  if (/\b(size|sizing|fit|fits|true to size|measurement|size (chart|guide)|run (small|large|big))\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1 && hits[0].fit) {
      return {
        content: `${hits[0].name} — ${hits[0].fit}`,
        links: [{ label: `Open ${hits[0].name}`, to: `/product/${hits[0].slug}` }],
      };
    }
    return faqReply(byId('sizing'));
  }

  // 7 — shipping / delivery / tracking
  if (/\b(ship|shipping|deliver|delivery|dispatch|courier|freight|how long|lead time|arrive|track|tracking|customs|dut(y|ies))\b/.test(text)) {
    if (/\b(cost|charge|fee|price|how much|free)\b/.test(text)) return faqReply(byId('delivery-cost'));
    return faqReply(byId('shipping'));
  }

  // 8 — returns / refunds
  if (/\b(return|refund|exchange|send back|money back|faulty|damaged|defective|wrong (item|size))\b/.test(text)) {
    return faqReply(byId('returns'));
  }

  // 9 — payment / currency
  if (/\b(pay|payment|card|paypal|razorpay|paystack|flutterwave|checkout method)\b/.test(text)) {
    return faqReply(byId('payment'));
  }
  if (/\b(currency|exchange rate|convert|in (usd|inr|naira|rupees|dollars|pounds)|change (the )?currency)\b/.test(text)) {
    return faqReply(byId('currency'));
  }

  // 10 — order help / account
  if (/\b(my order|order status|where('s| is) my order|order number|track my order|change my order|cancel my order)\b/.test(text)) {
    return faqReply(byId('order-help'));
  }
  if (/\b(account|sign ?in|log ?in|register|sign ?up|create (an )?account|password|my (details|address))\b/.test(text)) {
    return faqReply(byId('account'));
  }

  // 11 — navigation / how-to
  if (/\b(where (can i|do i)|how do i|find|navigate|go to|link to|show me the)\b/.test(text)) {
    const nav = navGuess(text);
    if (nav) return nav;
  }

  // 12 — about / what we sell
  if (/\b(about|company|based|who (is|are)|what is azraa|story)\b/.test(text)) return faqReply(byId('company'));
  if (/\b(what do you (sell|have|stock|carry|offer)|categor|range|catalog|collection|products?)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length && hits.length <= 5) {
      return {
        content: `Here's what matches — tap one to open it.`,
        products: hits.map((p) => productCard(p, context)),
      };
    }
    return faqReply(byId('categories'));
  }

  // 13 — direct product mention ("do you have leather sandals", "show me the sling bag")
  const hits = findProducts(text);
  if (hits.length === 1) {
    return {
      content: `Yes — ${hits[0].name}. ${hits[0].summary}`,
      products: [productCard(hits[0], context)],
      chips: [
        { label: 'Price & wholesale', send: `Price of ${hits[0].name}` },
        { label: 'In stock?', send: `Is the ${hits[0].name} in stock?` },
      ],
    };
  }
  if (hits.length > 1) {
    return {
      content: `A few things match — which one?`,
      products: hits.slice(0, 4).map((p) => productCard(p, context)),
    };
  }

  // 14 — FAQ keyword sweep (catches anything the intent rules missed)
  const faq = matchFaq(text);
  if (faq) return faqReply(faq);

  // 15 — fallback
  return {
    content:
      "I'm not certain I follow. I can help with products and pricing, wholesale and minimum orders, stock, delivery, returns, payment and getting through checkout. Try one of these — or ask a person.",
    chips: quickStart(),
    handoff: true,
  };
}

/* ────────────────────────────  builders  ──────────────────────────── */

/** region-aware, formatted price for a product + mode, or '' if unavailable */
function priceIn(p, mode, context) {
  const r = resolvePrice(p, mode, context.currency || 'USD', context.rates, context.locale);
  return r && !r.status ? r.formatted : '';
}

function priceReply(p, context, { lead } = {}) {
  const retail = priceIn(p, 'retail', context);
  const wholesale = priceIn(p, 'wholesale', context);
  const moq = p.wholesale?.moq;
  const unit = p.unit === 'pair' ? 'pairs' : 'pieces';

  let content;
  if (lead === 'wholesale' && wholesale) {
    content = `${p.name} — wholesale is ${wholesale} per ${p.unit}, from ${moq} ${unit}. Retail (single units) is ${retail}.`;
  } else {
    content = `${p.name}\nRetail: ${retail || '—'} per ${p.unit}\nWholesale: ${wholesale || '—'} per ${p.unit}${moq ? ` (from ${moq} ${unit})` : ''}`;
  }
  return {
    content,
    products: [productCard(p, context)],
    links: [{ label: `Open ${p.name}`, to: `/product/${p.slug}` }],
    chips: [
      { label: 'Is it in stock?', send: `Is the ${p.name} in stock?` },
      { label: 'What sizes?', send: `What sizes does the ${p.name} come in?` },
    ],
  };
}

function moqReply() {
  // group products by minimum order quantity, straight from the catalogue
  const groups = new Map();
  for (const p of PRODUCTS) {
    const moq = p.wholesale?.moq;
    if (!moq) continue;
    const unit = p.unit === 'pair' ? 'pairs' : 'pieces';
    const key = `${moq} ${unit}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p.subcategory || p.name);
  }
  const lines = [...groups.entries()].map(
    ([qty, names]) => `• ${[...new Set(names)].join(', ')} — from ${qty}`
  );
  return {
    content:
      `Wholesale minimums are per product:\n${lines.join('\n')}\n\nYou can mix colours and sizes within the minimum. Open a product and switch to “Wholesale” to see its exact figure.`,
    links: [{ label: 'How wholesale works', to: '/wholesale' }],
  };
}

function stockReply(list) {
  const lines = list.map((p) => {
    const state = availability(p);
    return `• ${p.name} — ${availabilityLabel(state) || 'availability on request'}`;
  });
  return {
    content: `${lines.join('\n')}\n\nStock updates live as orders come in.`,
    links: list.slice(0, 3).map((p) => ({ label: p.name, to: `/product/${p.slug}` })),
  };
}

function faqReply(faq) {
  if (!faq) return { content: "I don't have a clean answer for that — a person can help." , handoff: true };
  return {
    content: faq.answer,
    links: faq.links || [],
    chips: relatedChips(faq),
  };
}

function navGuess(text) {
  const table = [
    [/wholesale|trade/, { label: 'Wholesale', to: '/wholesale' }],
    [/checkout|cart|bag|basket/, { label: 'Your bag', to: '/cart' }],
    [/account|order|profile/, { label: 'Your account', to: '/account' }],
    [/contact|support|help desk/, { label: 'Contact', to: '/contact' }],
    [/about|company/, { label: 'About AZRAA', to: '/about' }],
    [/shoe|footwear|sneaker|sandal/, { label: 'Shoes', to: '/shop/shoes' }],
    [/\bbag(s)?\b|sling/, { label: 'Bags', to: '/shop/bags' }],
    [/ladies|women/, { label: 'Ladies', to: '/shop/ladies' }],
    [/men|tee|t-?shirt|singlet|vest/, { label: 'Men', to: '/shop/men' }],
    [/shop|browse|all products|catalog/, { label: 'Shop all', to: '/shop' }],
    [/return|refund/, { label: 'Returns & refunds', to: '/legal/returns' }],
    [/shipping|delivery/, { label: 'Shipping & delivery', to: '/legal/shipping' }],
    [/privacy/, { label: 'Privacy policy', to: '/legal/privacy' }],
    [/terms/, { label: 'Terms & conditions', to: '/legal/terms' }],
  ];
  const found = table.filter(([re]) => re.test(text)).map(([, link]) => link);
  if (!found.length) return null;
  return {
    content: found.length === 1 ? `Here you go:` : `A few places that might be what you mean:`,
    links: found.slice(0, 4),
  };
}

/* ────────────────────────────  product search  ──────────────────────────── */

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'you', 'have', 'in', 'stock', 'price', 'of', 'for', 'me', 'show', 'what', 'how', 'much', 'and', 'to', 'i', 'want', 'need', 'looking', 'your', 'my', 'can', 'get', 'buy', 'about', 'tell']);

function findProducts(text) {
  // exact multi-word product name in the query wins outright
  const named = PRODUCTS.filter((p) => p.name.includes(' ') && text.includes(p.name.toLowerCase()));
  if (named.length) return named;

  const words = text.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return [];

  const scored = PRODUCTS.map((p) => {
    const hay = [p.name, p.summary, p.category, p.subcategory, ...(p.tags || []), p.plate?.motif]
      .filter(Boolean).join(' ').toLowerCase();
    let score = 0;
    for (const w of words) {
      if (p.name.toLowerCase().includes(w)) score += 5;
      else if (hay.includes(w)) score += 2;
      // singular/plural tolerance
      else if (w.endsWith('s') && hay.includes(w.slice(0, -1))) score += 2;
      else if (hay.includes(`${w}s`)) score += 2;
    }
    // whole-phrase name match wins
    if (text.includes(p.name.toLowerCase())) score += 10;
    return { p, score };
  }).filter((s) => s.score >= 2);

  scored.sort((a, b) => b.score - a.score);
  // if the top score dominates, return just that one
  if (scored.length && scored[0].score >= scored[1]?.score * 2) return [scored[0].p];
  return scored.slice(0, 5).map((s) => s.p);
}

function productCard(p, context) {
  return {
    slug: p.slug,
    name: p.name,
    category: getCategory(p.category)?.name || p.category,
    priceText: priceIn(p, 'retail', context),
    motif: p.plate?.motif || p.name.slice(0, 2).toUpperCase(),
  };
}

/* ────────────────────────────  helpers  ──────────────────────────── */

const byId = (id) => FAQS.find((f) => f.id === id);

function matchFaq(text) {
  let best = null;
  let bestScore = 0;
  for (const f of FAQS) {
    let score = 0;
    for (const k of f.keywords) if (text.includes(k)) score += k.split(' ').length;
    if (score > bestScore) { bestScore = score; best = f; }
  }
  return bestScore >= 1 ? best : null;
}

function relatedChips(faq) {
  const map = {
    'wholesale-how': [{ label: 'Minimum order quantities', send: 'What are the minimum order quantities?' }],
    'trade-account': [{ label: 'How wholesale works', send: 'How does wholesale work?' }],
    'shipping': [{ label: 'How much is delivery?', send: 'How much is delivery?' }],
    'delivery-cost': [{ label: 'How long does delivery take?', send: 'How long does delivery take?' }],
    'returns': [{ label: 'Talk to a person', send: 'I want to talk to a person' }],
    'sizing': [{ label: 'Browse the range', send: 'What do you sell?' }],
    'stock': [{ label: 'Browse the range', send: 'What do you sell?' }],
    'company': [{ label: 'Shop the range', send: 'What do you sell?' }],
    'payment': [{ label: 'Currency & pricing', send: 'How does currency work?' }],
  };
  return map[faq.id] || [];
}

function quickStart() {
  return [
    { label: 'What do you sell?', send: 'What do you sell?' },
    { label: 'Wholesale & MOQ', send: 'How does wholesale work?' },
    { label: 'Delivery', send: 'Tell me about delivery' },
    { label: 'Talk to a person', send: 'I want to talk to a person' },
  ];
}

function productChips() {
  return activeCategories().map((c) => ({ label: c.name, send: `Show me ${c.name.toLowerCase()}` }));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fill in every field so the UI can render without guarding. */
function normalise(reply = {}) {
  return {
    role: 'assistant',
    content: (reply.content || '').trim() || "Sorry — I didn't catch that.",
    chips: Array.isArray(reply.chips) ? reply.chips.filter((c) => c && c.label && c.send) : [],
    products: Array.isArray(reply.products)
      ? reply.products.map(resolveProduct).filter(Boolean)
      : [],
    links: Array.isArray(reply.links) ? reply.links.filter((l) => l && l.label && l.to) : [],
    handoff: Boolean(reply.handoff),
  };
}

// backend may send bare slugs; the UI wants { slug, name, priceText, motif }
function resolveProduct(entry) {
  if (entry && typeof entry === 'object' && entry.name) return entry;
  const p = PRODUCTS.find((x) => x.slug === entry);
  return p ? { slug: p.slug, name: p.name, category: p.category, priceText: '', motif: p.plate?.motif } : null;
}

/**
 * @typedef {Object} AssistantReply
 * @property {'assistant'} role
 * @property {string} content
 * @property {{label:string,send:string}[]} chips
 * @property {{slug:string,name:string,category:string,priceText:string,motif:string}[]} products
 * @property {{label:string,to:string}[]} links
 * @property {boolean} handoff
 */
