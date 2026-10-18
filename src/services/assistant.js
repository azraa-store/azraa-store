// AZRAA assistant, the engine.
//
// Two modes, chosen at runtime:
//
//   1. REAL MODEL (production), if `VITE_ASSISTANT_ENDPOINT` is set, every turn
//      is POSTed to that backend, which runs the conversation against a model
//      (e.g. `claude-opus-5`) with a system prompt + the live catalogue as
//      context/tools, and returns the shaped reply below. The model key and the
//      prompt live server-side, never in the browser. Backend contract:
//
//        POST <VITE_ASSISTANT_ENDPOINT>
//        body:  { messages: [{role,content}], context: {..., lang} }
//        200:   { content: string, chips?: [{label,send}],
//                 products?: [slug], links?: [{label,to}], handoff?: boolean }
//
//   2. LOCAL KNOWLEDGE ENGINE (default / offline), answers from the site's own
//      data: catalogue, categories, region-aware pricing, live inventory,
//      logistics and a curated FAQ set. No network, no key.
//
// Routing is English keyword matching; the text a customer *reads* is localised
// via src/i18n/assistant.js (six languages). Chip `send` values stay English so
// tapping a chip still routes correctly whatever the UI language.

import { PRODUCTS } from '../data/products.js';
import { activeCategories, getCategory } from '../data/categories.js';
import { FAQS } from '../data/faqs.js';
import { resolvePrice } from './pricing.js';
import { availability } from './inventory.js';
import { t, routeLabel, DEFAULT_LANG } from '../i18n/assistant.js';

const ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT || '';

/* ────────────────────────────  public API  ──────────────────────────── */

export const assistantMode = ENDPOINT ? 'model' : 'local';

/**
 * @param {{ messages: {role:string,content:string}[], context: object }} args
 * @returns {Promise<AssistantReply>}
 */
export async function askAssistant({ messages, context = {} }) {
  const lang = context.lang || DEFAULT_LANG;
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
      return normalise(await res.json(), lang);
    } catch (err) {
      // fall through to the local engine so the bot never goes dark
      console.warn('[AZRAA] assistant endpoint unavailable, using local engine:', err.message);
    }
  }

  await wait(360 + Math.random() * 420); // a natural beat before replying
  return normalise(localAnswer(text, context), lang);
}

/** Opening message when the panel is first opened, in the chosen language. */
export function greeting(context = {}) {
  const lang = context.lang || DEFAULT_LANG;
  const region = context.country ? t(lang, 'greetingRegion', { country: context.country }) : '';
  const handoff = lang === DEFAULT_LANG ? '' : t(lang, 'greetingHandoff');
  return normalise(
    {
      content: t(lang, 'greeting', { region }) + handoff,
      chips: [
        chip(lang, 'chip_browse', 'What do you sell?'),
        chip(lang, 'chip_wholesale', 'How does wholesale work?'),
        chip(lang, 'chip_deliveryReturns', 'Tell me about delivery and returns'),
        chip(lang, 'chip_talkPerson', 'I want to talk to a person'),
      ],
      handoff: lang !== DEFAULT_LANG,
    },
    lang
  );
}

/* ────────────────────────────  local engine  ──────────────────────────── */

/** @returns {AssistantReply} */
function localAnswer(raw, context) {
  const lang = context.lang || DEFAULT_LANG;
  const text = raw.toLowerCase();
  if (!text) return { content: t(lang, 'askMore') };

  // 1, greetings / thanks / identity
  if (/^(hi|hey|hello|yo|good (morning|afternoon|evening)|howdy)\b/.test(text)) {
    return { content: t(lang, 'hello'), chips: quickStart(lang) };
  }
  if (/\b(thanks|thank you|cheers|appreciate)\b/.test(text)) {
    return { content: t(lang, 'thanks'), chips: quickStart(lang) };
  }
  if (/\b(who are you|what are you|your name|azraa bot)\b/.test(text)) {
    return faqReply(byId('company'), lang);
  }

  // 2, human handoff
  if (/\b(human|real person|agent|talk to (a )?(person|someone|human)|speak to|customer (service|care|support)|complain)\b/.test(text)
      || /\bwhatsapp\b/.test(text)) {
    return { ...faqReply(byId('contact-human'), lang), handoff: true };
  }

  // 3, pricing / cost
  if (/\b(price|cost|how much|pricing|rate|expensive|cheap|\$|₹|rupee|dollar)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) return priceReply(hits[0], context);
    if (hits.length > 1) {
      return {
        content: t(lang, 'pricingClosest'),
        products: hits.slice(0, 4).map((p) => productCard(p, context)),
      };
    }
    return { content: t(lang, 'priceIntro'), chips: productChips(lang) };
  }

  // 4, wholesale / MOQ
  if (/\b(wholesale|bulk|moq|minimum order|minimum quantity|reseller|distribut|trade account|buy in bulk|per unit|unit price)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) return priceReply(hits[0], context, { lead: 'wholesale' });
    if (/\b(moq|minimum (order|quantit)|smallest order|how (many|much).*(minimum|least)|pack size)\b/.test(text)) {
      return moqReply(lang);
    }
    return faqReply(byId(/trade account|net terms|credit/.test(text) ? 'trade-account' : 'wholesale-how'), lang);
  }

  // 5, stock / availability
  if (/\b(in stock|out of stock|stock|available|availability|sold out|restock)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1) {
      const p = hits[0];
      return {
        content: t(lang, 'stockSingle', { name: p.name, status: availLabel(lang, availability(p)) }),
        products: [productCard(p, context)],
      };
    }
    if (hits.length > 1) return stockReply(hits.slice(0, 4), lang);
    return faqReply(byId('stock'), lang);
  }

  // 6, sizing / fit
  if (/\b(size|sizing|fit|fits|true to size|measurement|size (chart|guide)|run (small|large|big))\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length === 1 && hits[0].fit && lang === DEFAULT_LANG) {
      return {
        content: `${hits[0].name}, ${hits[0].fit}`,
        links: [{ label: t(lang, 'openProduct', { name: hits[0].name }), to: `/product/${hits[0].slug}` }],
      };
    }
    return faqReply(byId('sizing'), lang);
  }

  // 7, shipping / delivery / tracking
  if (/\b(ship|shipping|deliver|delivery|dispatch|courier|freight|how long|lead time|arrive|track|tracking|customs|dut(y|ies))\b/.test(text)) {
    if (/\b(cost|charge|fee|price|how much|free)\b/.test(text)) return faqReply(byId('delivery-cost'), lang);
    return faqReply(byId('shipping'), lang);
  }

  // 8, returns / refunds
  if (/\b(return|refund|exchange|send back|money back|faulty|damaged|defective|wrong (item|size))\b/.test(text)) {
    return faqReply(byId('returns'), lang);
  }

  // 9, payment / currency
  if (/\b(pay|payment|card|paypal|razorpay|paystack|flutterwave|checkout method)\b/.test(text)) {
    return faqReply(byId('payment'), lang);
  }
  if (/\b(currency|exchange rate|convert|in (usd|inr|naira|rupees|dollars|pounds)|change (the )?currency)\b/.test(text)) {
    return faqReply(byId('currency'), lang);
  }

  // 10, order help / account
  if (/\b(my order|order status|where('s| is) my order|order number|track my order|change my order|cancel my order)\b/.test(text)) {
    return faqReply(byId('order-help'), lang);
  }
  if (/\b(account|sign ?in|log ?in|register|sign ?up|create (an )?account|password|my (details|address))\b/.test(text)) {
    return faqReply(byId('account'), lang);
  }

  // 11, navigation / how-to
  if (/\b(where (can i|do i)|how do i|find|navigate|go to|link to|show me the)\b/.test(text)) {
    const nav = navGuess(text, lang);
    if (nav) return nav;
  }

  // 12, about / what we sell
  if (/\b(about|company|based|who (is|are)|what is azraa|story)\b/.test(text)) return faqReply(byId('company'), lang);
  if (/\b(what do you (sell|have|stock|carry|offer)|categor|range|catalog|collection|products?)\b/.test(text)) {
    const hits = findProducts(text);
    if (hits.length && hits.length <= 5) {
      return { content: t(lang, 'matchesTap'), products: hits.map((p) => productCard(p, context)) };
    }
    return faqReply(byId('categories'), lang);
  }

  // 13, direct product mention
  const hits = findProducts(text);
  if (hits.length === 1) {
    const p = hits[0];
    const content = lang === DEFAULT_LANG
      ? t(lang, 'yesProduct', { name: p.name, summary: p.summary })
      : t(lang, 'yesProductShort', { name: p.name, price: priceIn(p, 'retail', context) || 'N/A' });
    return {
      content,
      products: [productCard(p, context)],
      chips: [
        chip(lang, 'chip_priceWholesale', `Price of ${p.name}`),
        chip(lang, 'chip_inStock', `Is the ${p.name} in stock?`),
      ],
    };
  }
  if (hits.length > 1) {
    return { content: t(lang, 'fewMatch'), products: hits.slice(0, 4).map((p) => productCard(p, context)) };
  }

  // 14, FAQ keyword sweep
  const faq = matchFaq(text);
  if (faq) return faqReply(faq, lang);

  // 15, fallback
  return { content: t(lang, 'fallback'), chips: quickStart(lang), handoff: true };
}

/* ────────────────────────────  builders  ──────────────────────────── */

function priceIn(p, mode, context) {
  const r = resolvePrice(p, mode, context.currency || 'USD', context.rates, context.locale);
  return r && !r.status ? r.formatted : '';
}

function priceReply(p, context, { lead } = {}) {
  const lang = context.lang || DEFAULT_LANG;
  const retail = priceIn(p, 'retail', context);
  const wholesale = priceIn(p, 'wholesale', context);
  const moq = p.wholesale?.moq;
  const unit = t(lang, p.unit === 'pair' ? 'unitPair' : 'unitPiece');
  const units = t(lang, p.unit === 'pair' ? 'unitsPairs' : 'unitsPieces');

  let content;
  if (lead === 'wholesale' && wholesale) {
    content = t(lang, 'priceWholesaleLead', {
      name: p.name, price: wholesale, unit, moq, units, retail: retail || 'N/A',
    });
  } else {
    const wLine = moq
      ? t(lang, 'priceWholesaleFrom', { price: wholesale || 'N/A', unit, moq, units })
      : t(lang, 'priceWholesale', { price: wholesale || 'N/A', unit });
    content = `${p.name}\n${t(lang, 'priceRetail', { price: retail || 'N/A', unit })}\n${wLine}`;
  }
  return {
    content,
    products: [productCard(p, context)],
    links: [{ label: t(lang, 'openProduct', { name: p.name }), to: `/product/${p.slug}` }],
    chips: [
      chip(lang, 'chip_inStock', `Is the ${p.name} in stock?`),
      chip(lang, 'chip_sizes', `What sizes does the ${p.name} come in?`),
    ],
  };
}

function moqReply(lang) {
  const groups = new Map();
  for (const p of PRODUCTS) {
    const moq = p.wholesale?.moq;
    if (!moq) continue;
    const units = t(lang, p.unit === 'pair' ? 'unitsPairs' : 'unitsPieces');
    const key = `${moq} ${units}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p.subcategory || p.name);
  }
  const lines = [...groups.entries()].map(([qty, names]) =>
    t(lang, 'moqLine', { names: [...new Set(names)].join(', '), qty })
  );
  return {
    content: `${t(lang, 'moqIntro')}\n${lines.join('\n')}\n\n${t(lang, 'moqMix')}`,
    links: [{ label: routeLabel(lang, '/wholesale'), to: '/wholesale' }],
  };
}

function stockReply(list, lang) {
  const rows = list.map((p) => `• ${p.name}, ${availLabel(lang, availability(p))}`);
  return {
    content: `${rows.join('\n')}\n\n${t(lang, 'stockUpdates')}`,
    links: list.slice(0, 3).map((p) => ({ label: p.name, to: `/product/${p.slug}` })),
  };
}

function faqReply(faq, lang) {
  if (!faq) return { content: t(lang, 'noCleanAnswer'), handoff: true };
  return {
    content: faq.answer?.[lang] || faq.answer?.en || '',
    links: (faq.links || []).map((l) => ({ label: routeLabel(lang, l.to), to: l.to })),
    chips: relatedChips(faq, lang),
  };
}

function navGuess(text, lang) {
  const table = [
    [/wholesale|trade/, '/wholesale'],
    [/checkout|cart|bag|basket/, '/cart'],
    [/account|order|profile/, '/account'],
    [/contact|support|help desk/, '/contact'],
    [/about|company/, '/about'],
    [/shoe|footwear|sneaker|sandal/, '/shop/shoes'],
    [/\bbag(s)?\b|sling/, '/shop/bags'],
    [/ladies|women/, '/shop/ladies'],
    [/men|tee|t-?shirt|singlet|vest/, '/shop/men'],
    [/shop|browse|all products|catalog/, '/shop'],
    [/return|refund/, '/legal/returns'],
    [/shipping|delivery/, '/legal/shipping'],
    [/privacy/, '/legal/privacy'],
    [/terms/, '/legal/terms'],
  ];
  const routes = [...new Set(table.filter(([re]) => re.test(text)).map(([, to]) => to))];
  if (!routes.length) return null;
  return {
    content: routes.length === 1 ? t(lang, 'navHere') : t(lang, 'navFew'),
    links: routes.slice(0, 4).map((to) => ({ label: routeLabel(lang, to), to })),
  };
}

/* ────────────────────────────  product search  ──────────────────────────── */

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'you', 'have', 'in', 'stock', 'price', 'of', 'for', 'me', 'show', 'what', 'how', 'much', 'and', 'to', 'i', 'want', 'need', 'looking', 'your', 'my', 'can', 'get', 'buy', 'about', 'tell']);

function findProducts(text) {
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
      else if (w.endsWith('s') && hay.includes(w.slice(0, -1))) score += 2;
      else if (hay.includes(`${w}s`)) score += 2;
    }
    if (text.includes(p.name.toLowerCase())) score += 10;
    return { p, score };
  }).filter((s) => s.score >= 2);

  scored.sort((a, b) => b.score - a.score);
  if (scored.length && scored[0].score >= scored[1]?.score * 2) return [scored[0].p];
  return scored.slice(0, 5).map((s) => s.p);
}

function productCard(p, context) {
  const lang = context.lang || DEFAULT_LANG;
  return {
    slug: p.slug,
    name: p.name,
    category: routeLabel(lang, `/shop/${p.category}`) || getCategory(p.category)?.name || p.category,
    priceText: priceIn(p, 'retail', context),
    motif: p.plate?.motif || p.name.slice(0, 2).toUpperCase(),
  };
}

/* ────────────────────────────  helpers  ──────────────────────────── */

const byId = (id) => FAQS.find((f) => f.id === id);
const chip = (lang, key, send) => ({ label: t(lang, key), send });

function availLabel(lang, state) {
  const map = { in: 'availIn', low: 'availLow', out: 'availOut' };
  return map[state] ? t(lang, map[state]) : t(lang, 'availOnRequest');
}

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

function relatedChips(faq, lang) {
  const map = {
    'wholesale-how': [['chip_moq', 'What are the minimum order quantities?']],
    'trade-account': [['chip_howWholesale', 'How does wholesale work?']],
    'shipping': [['chip_deliveryCost', 'How much is delivery?']],
    'delivery-cost': [['chip_deliveryTime', 'How long does delivery take?']],
    'returns': [['chip_talkPerson', 'I want to talk to a person']],
    'sizing': [['chip_browse', 'What do you sell?']],
    'stock': [['chip_browse', 'What do you sell?']],
    'company': [['chip_shopRange', 'What do you sell?']],
    'payment': [['chip_currency', 'How does currency work?']],
  };
  return (map[faq.id] || []).map(([key, send]) => chip(lang, key, send));
}

function quickStart(lang) {
  return [
    chip(lang, 'chip_whatSell', 'What do you sell?'),
    chip(lang, 'chip_wholesaleMoq', 'How does wholesale work?'),
    chip(lang, 'chip_delivery', 'Tell me about delivery'),
    chip(lang, 'chip_talkPerson', 'I want to talk to a person'),
  ];
}

function productChips(lang) {
  return activeCategories().map((c) => ({
    label: routeLabel(lang, `/shop/${c.slug}`) || c.name,
    send: `Show me ${c.name.toLowerCase()}`,
  }));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fill in every field so the UI can render without guarding. */
function normalise(reply = {}, lang = DEFAULT_LANG) {
  return {
    role: 'assistant',
    content: (reply.content || '').trim() || t(lang, 'notCaught'),
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
