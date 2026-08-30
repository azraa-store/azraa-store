// Curated knowledge base for AZRAA Bot. Kept in sync with the legal documents,
// the wholesale page and the logistics config. Each entry: a topic, the phrases
// that should match it, a concise answer, and optional follow-up links.
//
// The answer text is written to be read aloud in a chat bubble — short
// paragraphs, no headings.

export const FAQS = [
  {
    id: 'wholesale-how',
    topic: 'Wholesale',
    keywords: ['wholesale', 'bulk', 'trade', 'reseller', 'distributor', 'moq', 'minimum order', 'minimum quantity', 'buy in bulk', 'retailer'],
    answer:
      'Wholesale is a direct purchase — no enquiry or quote needed for standard orders. Open any product, switch to “Wholesale”, enter a quantity at or above its minimum, and check out at the wholesale unit price. Every product in the store carries both a retail and a wholesale price.',
    links: [
      { label: 'How wholesale works', to: '/wholesale' },
      { label: 'Open a trade account', to: '/wholesale/enquiry' },
    ],
  },
  {
    id: 'trade-account',
    topic: 'Trade accounts',
    keywords: ['trade account', 'account terms', 'net terms', 'credit terms', 'tiered pricing', 'custom pricing', 'large order', 'container', 'invoice'],
    answer:
      'For customer-specific pricing, payment terms or large recurring orders, open a trade account. Standard wholesale orders don’t need one — you can buy at the listed wholesale price straight away.',
    links: [{ label: 'Open a trade account', to: '/wholesale/enquiry' }],
  },
  {
    id: 'shipping',
    topic: 'Shipping & delivery',
    keywords: ['shipping', 'delivery', 'deliver', 'ship', 'dispatch', 'how long', 'lead time', 'arrive', 'courier', 'freight', 'tracking', 'track'],
    answer:
      'Orders ship to the country you select at checkout — tracked courier for retail, consolidated freight for wholesale. Retail delivery is typically 5–9 working days standard, or 2–4 on express. Wholesale and export lead times are quoted per order. A tracking reference is emailed on dispatch and shown in your account.',
    links: [{ label: 'Shipping & delivery', to: '/legal/shipping' }],
  },
  {
    id: 'delivery-cost',
    topic: 'Delivery charge',
    keywords: ['delivery cost', 'delivery charge', 'delivery fee', 'shipping cost', 'shipping fee', 'shipping charge', 'postage', 'how much is delivery', 'how much is shipping', 'free shipping', 'free delivery'],
    answer:
      'Delivery is a flat charge per order — ₹40 (about $0.44) for retail and ₹30 (about $0.33) for wholesale, shown in your local currency at checkout. Express adds a surcharge. Cross-border duties, where they apply, are the buyer’s responsibility unless a quote says otherwise.',
    links: [{ label: 'Shipping & delivery', to: '/legal/shipping' }],
  },
  {
    id: 'returns',
    topic: 'Returns & refunds',
    keywords: ['return', 'returns', 'refund', 'refunds', 'exchange', 'send back', 'money back', 'cancel order', 'wrong size', 'faulty', 'damaged', 'defective'],
    answer:
      'Unworn retail items with tags can be returned within 14 days of delivery for a refund to your original payment method. For anything faulty or incorrectly supplied, contact us with your order number and a photo and we’ll arrange a replacement or refund. Wholesale returns are handled under your account terms.',
    links: [
      { label: 'Returns & refunds', to: '/legal/returns' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    id: 'payment',
    topic: 'Payment',
    keywords: ['payment', 'pay', 'card', 'checkout', 'paypal', 'razorpay', 'paystack', 'flutterwave', 'how do i pay', 'payment method', 'accepted cards'],
    answer:
      'Payment methods depend on your region — Razorpay in India, Paystack and Flutterwave across Africa, and PayPal internationally. Card and payment details are handled entirely by the payment provider; AZRAA never stores full card numbers.',
    links: [{ label: 'Privacy & payments', to: '/legal/privacy' }],
  },
  {
    id: 'currency',
    topic: 'Currency & pricing',
    keywords: ['currency', 'exchange rate', 'usd', 'inr', 'rupees', 'naira', 'which currency', 'change currency', 'price in my currency', 'indicative price', 'conversion'],
    answer:
      'Prices show in the currency of the country you pick (top-right selector). India sees exact rupee prices; the United States sees US dollars; everywhere else is converted live from USD. Where a figure is marked indicative it’s an estimate — the payment provider confirms the exact local amount at checkout.',
  },
  {
    id: 'sizing',
    topic: 'Sizing & fit',
    keywords: ['size', 'sizing', 'fit', 'fits', 'true to size', 'size chart', 'size guide', 'measurements', 'what size', 'run small', 'run large', 'uk size', 'eu size'],
    answer:
      'Every product page has a “Fit & sizing” note. As a guide: the tees and singlets are a regular fit and true to size (size up for a looser drape). Leather shoes are true to size with half sizes rounding up; the canvas sneaker runs slightly narrow. Sandals use EU sizing — size down if you’re between sizes.',
  },
  {
    id: 'stock',
    topic: 'Stock & availability',
    keywords: ['stock', 'in stock', 'out of stock', 'available', 'availability', 'sold out', 'restock', 'back in stock', 'when will you have'],
    answer:
      'Stock is shown live on each product page and updates automatically as orders are placed. Full colour and size runs are held for wholesale. If a variant is out, check back — or message us and we’ll tell you the next run.',
  },
  {
    id: 'order-help',
    topic: 'Your order',
    keywords: ['my order', 'order status', 'where is my order', 'order number', 'change my order', 'update order', 'order confirmation', 'didnt get', 'did not receive'],
    answer:
      'Your orders — with status and tracking — live in your account under “Orders”. I can’t look up a specific order from here, but if something’s wrong, message us with your order number and we’ll sort it.',
    links: [
      { label: 'Your orders', to: '/account' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    id: 'account',
    topic: 'Accounts',
    keywords: ['account', 'sign in', 'log in', 'login', 'register', 'sign up', 'create account', 'password', 'reset password', 'forgot password', 'my details', 'address book'],
    answer:
      'You can browse and check out without an account, but signing in keeps your orders, addresses and (for wholesale) your company details in one place.',
    links: [
      { label: 'Sign in', to: '/sign-in' },
      { label: 'Create an account', to: '/sign-up' },
    ],
  },
  {
    id: 'company',
    topic: 'About AZRAA',
    keywords: ['about', 'who are you', 'what is azraa', 'company', 'where are you based', 'brand', 'story', 'azraa bot'],
    answer:
      'AZRAA is a wholesale-focused commerce company supplying clothing, footwear and accessories across Asia and Africa, with staple foods planned next. The idea is simple: buy well, hold real stock, price to volume, and make purchasing straightforward whether the order is one piece or a full container. I’m AZRAA Bot — here to help you find products, understand pricing and get through checkout.',
    links: [{ label: 'About AZRAA', to: '/about' }],
  },
  {
    id: 'categories',
    topic: 'What we sell',
    keywords: ['what do you sell', 'what do you have', 'categories', 'product range', 'catalogue', 'catalog', 'collections', 'range'],
    answer:
      'Four lines right now: Men (tees and singlets), Shoes (leather shoes, canvas sneakers and sandals), Bags (cross-body slings), and Ladies (leather bags). Food is planned but not live yet.',
    links: [
      { label: 'Shop all', to: '/shop' },
      { label: 'Men', to: '/shop/men' },
      { label: 'Shoes', to: '/shop/shoes' },
    ],
  },
  {
    id: 'contact-human',
    topic: 'Talk to a person',
    keywords: ['human', 'agent', 'real person', 'talk to someone', 'customer service', 'customer care', 'support team', 'phone', 'email', 'whatsapp', 'call you', 'speak to'],
    answer:
      'Happy to hand you over. The quickest way to reach a person is WhatsApp — otherwise the contact form gets you the wholesale desk or customer care.',
    links: [{ label: 'Contact us', to: '/contact' }],
  },
];

export const FAQ_TOPICS = [...new Set(FAQS.map((f) => f.topic))];
