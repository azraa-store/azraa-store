// AZRAA assistant, languages + string table.
//
// The assistant offers six languages covering AZRAA's markets. The rule engine
// still routes on English keywords, so chip `send` values stay English; only the
// text a customer *reads* is translated here.
//
// ⚠ Non-English strings are a first pass, have a native speaker review before
// launch, especially the policy answers in data/faqs.js.

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', dir: 'ltr' },
  { code: 'sw', label: 'Kiswahili', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export const DEFAULT_LANG = 'en';
export const LANG_CODES = LANGUAGES.map((l) => l.code);
export const isSupportedLang = (c) => LANG_CODES.includes(c);
export const langDir = (c) => (c === 'ar' ? 'rtl' : 'ltr');
export const langLabel = (c) => LANGUAGES.find((l) => l.code === c)?.label || c;

/* key-major so each string's six translations sit together */
const S = {
  /* ---- chrome ---- */
  role: {
    en: 'Shopping assistant', hi: 'शॉपिंग सहायक', bn: 'শপিং সহকারী',
    sw: 'Msaidizi wa ununuzi', fr: 'Assistant achats', ar: 'مساعد التسوّق',
  },
  placeholder: {
    en: 'Ask about products, pricing, delivery…',
    hi: 'उत्पाद, मूल्य, डिलीवरी के बारे में पूछें…',
    bn: 'পণ্য, দাম, ডেলিভারি সম্পর্কে জিজ্ঞাসা করুন…',
    sw: 'Uliza kuhusu bidhaa, bei, uwasilishaji…',
    fr: 'Produits, prix, livraison…',
    ar: 'اسأل عن المنتجات والأسعار والتوصيل…',
  },
  newChat: {
    en: 'New chat', hi: 'नई चैट', bn: 'নতুন চ্যাট',
    sw: 'Mazungumzo mapya', fr: 'Nouveau', ar: 'محادثة جديدة',
  },
  changeLanguage: {
    en: 'Change language', hi: 'भाषा बदलें', bn: 'ভাষা পরিবর্তন করুন',
    sw: 'Badilisha lugha', fr: 'Changer de langue', ar: 'تغيير اللغة',
  },
  closeAria: {
    en: 'Close the assistant', hi: 'सहायक बंद करें', bn: 'সহকারী বন্ধ করুন',
    sw: 'Funga msaidizi', fr: "Fermer l'assistant", ar: 'إغلاق المساعد',
  },
  openAria: {
    en: 'Open the AZRAA assistant', hi: 'AZRAA सहायक खोलें', bn: 'AZRAA সহকারী খুলুন',
    sw: 'Fungua msaidizi wa AZRAA', fr: "Ouvrir l'assistant AZRAA", ar: 'فتح مساعد AZRAA',
  },
  typing: {
    en: 'AZRAA is typing', hi: 'AZRAA लिख रहा है', bn: 'AZRAA টাইপ করছে',
    sw: 'AZRAA inaandika', fr: 'AZRAA écrit', ar: 'AZRAA يكتب',
  },
  fineLocal: {
    en: 'This assistant answers from AZRAA’s own product and policy information, check important details before ordering.',
    hi: 'यह सहायक AZRAA की अपनी उत्पाद और नीति जानकारी से उत्तर देता है, ऑर्डर करने से पहले ज़रूरी विवरण जाँच लें।',
    bn: 'এই সহকারী AZRAA-র নিজস্ব পণ্য ও নীতির তথ্য থেকে উত্তর দেয়, অর্ডার করার আগে গুরুত্বপূর্ণ তথ্য যাচাই করুন।',
    sw: 'Msaidizi huyu hujibu kwa taarifa za bidhaa na sera za AZRAA, hakiki maelezo muhimu kabla ya kuagiza.',
    fr: "Cet assistant répond à partir des informations produits et politiques d’AZRAA, vérifiez les détails importants avant de commander.",
    ar: 'يجيب هذا المساعد من معلومات منتجات وسياسات AZRAA, تحقّق من التفاصيل المهمة قبل الطلب.',
  },
  fineModel: {
    en: 'AZRAA is AI-assisted, check important details before ordering.',
    hi: 'AZRAA AI-सहायता प्राप्त है, ऑर्डर करने से पहले ज़रूरी विवरण जाँच लें।',
    bn: 'AZRAA AI-সহায়তাপ্রাপ্ত, অর্ডার করার আগে গুরুত্বপূর্ণ তথ্য যাচাই করুন।',
    sw: 'AZRAA inasaidiwa na AI, hakiki maelezo muhimu kabla ya kuagiza.',
    fr: "AZRAA est assisté par IA, vérifiez les détails importants avant de commander.",
    ar: 'AZRAA مدعوم بالذكاء الاصطناعي, تحقّق من التفاصيل المهمة قبل الطلب.',
  },

  /* ---- language gate ---- */
  chooseLanguage: {
    en: 'Choose your language', hi: 'अपनी भाषा चुनें', bn: 'আপনার ভাষা নির্বাচন করুন',
    sw: 'Chagua lugha yako', fr: 'Choisissez votre langue', ar: 'اختر لغتك',
  },
  chooseLanguageSub: {
    en: 'The assistant replies in your language. For anything detailed, our team can continue with you on WhatsApp.',
    hi: 'सहायक आपकी भाषा में उत्तर देता है। किसी भी विस्तृत सहायता के लिए हमारी टीम आपसे WhatsApp पर बात कर सकती है।',
    bn: 'সহকারী আপনার ভাষায় উত্তর দেয়। বিস্তারিত কিছুর জন্য আমাদের দল WhatsApp-এ আপনার সাথে কথা বলতে পারে।',
    sw: 'Msaidizi hujibu kwa lugha yako. Kwa jambo lolote la kina, timu yetu inaweza kuendelea nawe kupitia WhatsApp.',
    fr: "L’assistant répond dans votre langue. Pour tout ce qui est détaillé, notre équipe peut poursuivre avec vous sur WhatsApp.",
    ar: 'يردّ المساعد بلغتك. لأي مسألة تفصيلية، يمكن لفريقنا متابعة الحديث معك عبر واتساب.',
  },

  /* ---- smalltalk / meta ---- */
  greeting: {
    en: "Hi, I'm AZRAA, your shopping assistant.{region} I can help you find products, check pricing and stock, explain wholesale and delivery, or point you to the right page. What are you after?",
    hi: "नमस्ते, मैं AZRAA हूँ, आपका शॉपिंग सहायक।{region} मैं उत्पाद खोजने, कीमत और स्टॉक देखने, थोक और डिलीवरी समझाने, या सही पेज तक पहुँचाने में मदद कर सकता हूँ। आपको क्या चाहिए?",
    bn: "নমস্কার, আমি AZRAA, আপনার শপিং সহকারী।{region} আমি পণ্য খুঁজে দিতে, দাম ও স্টক দেখতে, পাইকারি ও ডেলিভারি বোঝাতে, বা সঠিক পেজে নিয়ে যেতে পারি। আপনি কী খুঁজছেন?",
    sw: "Habari, mimi ni AZRAA, msaidizi wako wa ununuzi.{region} Naweza kukusaidia kupata bidhaa, kuangalia bei na hisa, kueleza jumla na uwasilishaji, au kukuelekeza kwenye ukurasa sahihi. Unatafuta nini?",
    fr: "Bonjour, je suis AZRAA, votre assistant achats.{region} Je peux vous aider à trouver des produits, vérifier les prix et le stock, expliquer la vente en gros et la livraison, ou vous orienter vers la bonne page. Que cherchez-vous ?",
    ar: "مرحبًا، أنا AZRAA, مساعد التسوّق الخاص بك.{region} يمكنني مساعدتك في إيجاد المنتجات، والتحقق من الأسعار والمخزون، وشرح البيع بالجملة والتوصيل، أو إرشادك إلى الصفحة المناسبة. عمّ تبحث؟",
  },
  greetingRegion: {
    en: " You're shopping in {country}.",
    hi: " आप {country} में खरीदारी कर रहे हैं।",
    bn: " আপনি {country}-তে কেনাকাটা করছেন।",
    sw: " Unanunua ukiwa {country}.",
    fr: " Vous achetez depuis {country}.",
    ar: " أنت تتسوّق من {country}.",
  },
  greetingHandoff: {
    en: ' For detailed help, our team can continue with you on WhatsApp.',
    hi: ' विस्तृत सहायता के लिए हमारी टीम WhatsApp पर आपसे बात कर सकती है।',
    bn: ' বিস্তারিত সাহায্যের জন্য আমাদের দল WhatsApp-এ আপনার সাথে কথা বলতে পারে।',
    sw: ' Kwa msaada wa kina, timu yetu inaweza kuendelea nawe kupitia WhatsApp.',
    fr: " Pour une aide détaillée, notre équipe peut poursuivre sur WhatsApp.",
    ar: ' للحصول على مساعدة تفصيلية، يمكن لفريقنا متابعة الحديث معك عبر واتساب.',
  },
  hello: {
    en: 'Hello. What can I help you with, finding a product, pricing, wholesale, or an order?',
    hi: 'नमस्ते। मैं किसमें मदद करूँ, उत्पाद खोजना, कीमत, थोक, या ऑर्डर?',
    bn: 'নমস্কার। আমি কীসে সাহায্য করব, পণ্য খোঁজা, দাম, পাইকারি, নাকি অর্ডার?',
    sw: 'Habari. Nikusaidie na nini, kupata bidhaa, bei, jumla, au agizo?',
    fr: 'Bonjour. Comment puis-je vous aider, trouver un produit, les prix, la vente en gros, ou une commande ?',
    ar: 'مرحبًا. بماذا أساعدك, إيجاد منتج، الأسعار، البيع بالجملة، أو طلب؟',
  },
  thanks: {
    en: 'Anytime. Anything else I can help with?',
    hi: 'हमेशा। और किसी चीज़ में मदद करूँ?',
    bn: 'যেকোনো সময়। আর কিছুতে সাহায্য করতে পারি?',
    sw: 'Karibu. Kuna jambo lingine nikusaidie?',
    fr: 'Avec plaisir. Puis-je vous aider pour autre chose ?',
    ar: 'دائمًا في الخدمة. هل من شيء آخر أساعدك فيه؟',
  },
  askMore: {
    en: 'Ask me anything about AZRAA products, pricing, orders or delivery.',
    hi: 'AZRAA के उत्पाद, कीमत, ऑर्डर या डिलीवरी के बारे में कुछ भी पूछें।',
    bn: 'AZRAA-র পণ্য, দাম, অর্ডার বা ডেলিভারি সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন।',
    sw: 'Niulize chochote kuhusu bidhaa, bei, maagizo au uwasilishaji wa AZRAA.',
    fr: 'Posez-moi toute question sur les produits, prix, commandes ou la livraison AZRAA.',
    ar: 'اسألني أي شيء عن منتجات AZRAA وأسعارها وطلباتها أو التوصيل.',
  },
  fallback: {
    en: "I'm not certain I follow. I can help with products and pricing, wholesale and minimum orders, stock, delivery, returns, payment and getting through checkout. Try one of these, or ask a person.",
    hi: 'मुझे पूरी तरह समझ नहीं आया। मैं उत्पाद और कीमत, थोक और न्यूनतम ऑर्डर, स्टॉक, डिलीवरी, रिटर्न, भुगतान और चेकआउट में मदद कर सकता हूँ। इनमें से कोई चुनें, या किसी व्यक्ति से बात करें।',
    bn: 'আমি ঠিক বুঝতে পারিনি। আমি পণ্য ও দাম, পাইকারি ও ন্যূনতম অর্ডার, স্টক, ডেলিভারি, রিটার্ন, পেমেন্ট এবং চেকআউটে সাহায্য করতে পারি। এর একটি বেছে নিন, বা একজন ব্যক্তির সাথে কথা বলুন।',
    sw: 'Sina uhakika nimeelewa. Naweza kusaidia na bidhaa na bei, jumla na maagizo ya chini, hisa, uwasilishaji, marejesho, malipo na kukamilisha malipo. Jaribu mojawapo, au ongea na mtu.',
    fr: "Je ne suis pas sûr de comprendre. Je peux aider pour les produits et les prix, la vente en gros et les commandes minimales, le stock, la livraison, les retours, le paiement et le passage en caisse. Essayez l’une de ces options, ou parlez à une personne.",
    ar: 'لست متأكدًا أنني فهمت. يمكنني المساعدة في المنتجات والأسعار، والبيع بالجملة والحد الأدنى للطلبات، والمخزون، والتوصيل، والإرجاع، والدفع، وإتمام الشراء. جرّب أحد هذه الخيارات, أو تحدّث إلى شخص.',
  },
  notCaught: {
    en: "Sorry, I didn't catch that.", hi: 'क्षमा करें, मैं समझ नहीं पाया।',
    bn: 'দুঃখিত, আমি বুঝতে পারিনি।', sw: 'Samahani, sikuelewa.',
    fr: "Désolé, je n'ai pas compris.", ar: 'عذرًا, لم أفهم ذلك.',
  },
  error: {
    en: 'Something went wrong on my end. Please try again, or reach us on WhatsApp or the contact form.',
    hi: 'मेरी ओर से कुछ गड़बड़ हुई। कृपया फिर कोशिश करें, या WhatsApp या संपर्क फ़ॉर्म से हमसे संपर्क करें।',
    bn: 'আমার দিকে কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন, বা WhatsApp বা যোগাযোগ ফর্মে আমাদের সাথে যোগাযোগ করুন।',
    sw: 'Kuna hitilafu upande wangu. Tafadhali jaribu tena, au wasiliana nasi kupitia WhatsApp au fomu ya mawasiliano.',
    fr: "Une erreur est survenue de mon côté. Réessayez, ou contactez-nous sur WhatsApp ou via le formulaire de contact.",
    ar: 'حدث خطأ من جهتي. يرجى المحاولة مرة أخرى، أو التواصل معنا عبر واتساب أو نموذج الاتصال.',
  },
  noCleanAnswer: {
    en: "I don't have a clear answer for that, a person can help.",
    hi: 'इसका मेरे पास स्पष्ट उत्तर नहीं है, कोई व्यक्ति मदद कर सकता है।',
    bn: 'এর স্পষ্ট উত্তর আমার কাছে নেই, একজন ব্যক্তি সাহায্য করতে পারেন।',
    sw: 'Sina jibu wazi kwa hilo, mtu anaweza kusaidia.',
    fr: "Je n'ai pas de réponse claire à cela, une personne peut vous aider.",
    ar: 'ليس لديّ إجابة واضحة عن ذلك, يمكن لشخص مساعدتك.',
  },
  handoffBtn: {
    en: 'Chat on WhatsApp', hi: 'WhatsApp पर चैट करें', bn: 'WhatsApp-এ চ্যাট করুন',
    sw: 'Piga soga kwenye WhatsApp', fr: 'Discuter sur WhatsApp', ar: 'الدردشة عبر واتساب',
  },
  whatsappPrefill: {
    en: 'Hello AZRAA, I was chatting with the assistant and would like to speak to someone.',
    hi: 'नमस्ते AZRAA, मैं सहायक से बात कर रहा था और किसी व्यक्ति से बात करना चाहता हूँ।',
    bn: 'নমস্কার AZRAA, আমি সহকারীর সাথে কথা বলছিলাম এবং একজন ব্যক্তির সাথে কথা বলতে চাই।',
    sw: 'Habari AZRAA, nilikuwa naongea na msaidizi na ningependa kuongea na mtu.',
    fr: "Bonjour AZRAA, je discutais avec l'assistant et j'aimerais parler à quelqu'un.",
    ar: 'مرحبًا AZRAA, كنت أتحدث مع المساعد وأودّ التحدث إلى شخص.',
  },

  /* ---- price / stock / moq templates ---- */
  priceRetail: {
    en: 'Retail: {price} per {unit}', hi: 'खुदरा: {price} प्रति {unit}', bn: 'খুচরা: {price} প্রতি {unit}',
    sw: 'Rejareja: {price} kwa {unit}', fr: 'Détail : {price} / {unit}', ar: 'التجزئة: {price} لكل {unit}',
  },
  priceWholesale: {
    en: 'Wholesale: {price} per {unit}', hi: 'थोक: {price} प्रति {unit}', bn: 'পাইকারি: {price} প্রতি {unit}',
    sw: 'Jumla: {price} kwa {unit}', fr: 'Gros : {price} / {unit}', ar: 'الجملة: {price} لكل {unit}',
  },
  priceWholesaleFrom: {
    en: 'Wholesale: {price} per {unit} (from {moq} {units})',
    hi: 'थोक: {price} प्रति {unit} ({moq} {units} से)',
    bn: 'পাইকারি: {price} প্রতি {unit} ({moq} {units} থেকে)',
    sw: 'Jumla: {price} kwa {unit} (kuanzia {units} {moq})',
    fr: 'Gros : {price} / {unit} (à partir de {moq} {units})',
    ar: 'الجملة: {price} لكل {unit} (ابتداءً من {moq} {units})',
  },
  priceWholesaleLead: {
    en: '{name}, wholesale is {price} per {unit}, from {moq} {units}. Retail (single units) is {retail}.',
    hi: '{name}, थोक कीमत {price} प्रति {unit} है, {moq} {units} से। खुदरा (एकल) {retail} है।',
    bn: '{name}, পাইকারি দাম {price} প্রতি {unit}, {moq} {units} থেকে। খুচরা (একক) {retail}।',
    sw: '{name}, bei ya jumla ni {price} kwa {unit}, kuanzia {units} {moq}. Rejareja (kimoja) ni {retail}.',
    fr: '{name}, le prix de gros est {price} / {unit}, à partir de {moq} {units}. Le détail (à l’unité) est {retail}.',
    ar: '{name}, سعر الجملة {price} لكل {unit}، ابتداءً من {moq} {units}. سعر التجزئة (للقطعة) {retail}.',
  },
  unitPiece: { en: 'piece', hi: 'पीस', bn: 'পিস', sw: 'kipande', fr: 'pièce', ar: 'قطعة' },
  unitPair: { en: 'pair', hi: 'जोड़ी', bn: 'জোড়া', sw: 'jozi', fr: 'paire', ar: 'زوج' },
  unitsPieces: { en: 'pieces', hi: 'पीस', bn: 'পিস', sw: 'vipande', fr: 'pièces', ar: 'قطع' },
  unitsPairs: { en: 'pairs', hi: 'जोड़ी', bn: 'জোড়া', sw: 'jozi', fr: 'paires', ar: 'أزواج' },
  priceIntro: {
    en: "Every product has a retail price and a lower wholesale price (with a minimum quantity). Prices show in your selected currency. Tell me which product and I'll give you the exact figures.",
    hi: 'हर उत्पाद की एक खुदरा कीमत और एक कम थोक कीमत (न्यूनतम मात्रा के साथ) होती है। कीमतें आपकी चुनी हुई मुद्रा में दिखती हैं। बताइए कौन-सा उत्पाद, मैं सटीक आँकड़े दूँगा।',
    bn: 'প্রতিটি পণ্যের একটি খুচরা দাম এবং একটি কম পাইকারি দাম থাকে (ন্যূনতম পরিমাণ সহ)। দাম আপনার নির্বাচিত মুদ্রায় দেখানো হয়। কোন পণ্য বলুন, আমি সঠিক সংখ্যা দেব।',
    sw: 'Kila bidhaa ina bei ya rejareja na bei ya chini ya jumla (yenye kiasi cha chini). Bei huonyeshwa kwa sarafu uliyochagua. Niambie bidhaa gani nami nitakupa takwimu kamili.',
    fr: "Chaque produit a un prix de détail et un prix de gros inférieur (avec une quantité minimale). Les prix s'affichent dans la devise choisie. Dites-moi quel produit et je vous donnerai les chiffres exacts.",
    ar: 'لكل منتج سعر تجزئة وسعر جملة أقل (بحد أدنى من الكمية). تظهر الأسعار بالعملة التي اخترتها. أخبرني بالمنتج وسأعطيك الأرقام الدقيقة.',
  },
  pricingClosest: {
    en: "Here's pricing for the closest matches, open one for the full breakdown.",
    hi: 'निकटतम मिलानों की कीमत यहाँ है, पूरा विवरण देखने के लिए किसी एक को खोलें।',
    bn: 'নিকটতম মিলগুলোর দাম এখানে, সম্পূর্ণ বিবরণের জন্য একটি খুলুন।',
    sw: 'Hizi ni bei za bidhaa zinazolingana zaidi, fungua moja kwa maelezo kamili.',
    fr: 'Voici les prix des correspondances les plus proches, ouvrez-en une pour le détail complet.',
    ar: 'إليك أسعار أقرب النتائج, افتح واحدًا للتفاصيل الكاملة.',
  },
  matchesTap: {
    en: "Here's what matches, tap one to open it.",
    hi: 'ये मिलते हैं, खोलने के लिए किसी एक पर टैप करें।',
    bn: 'এগুলো মিলছে, খুলতে একটিতে ট্যাপ করুন।',
    sw: 'Hivi ndivyo vinavyolingana, gusa kimoja kukifungua.',
    fr: 'Voici les correspondances, appuyez pour ouvrir.',
    ar: 'هذه هي النتائج, انقر على واحد لفتحه.',
  },
  fewMatch: {
    en: 'A few things match, which one?', hi: 'कुछ चीज़ें मिलती हैं, कौन-सी?',
    bn: 'কয়েকটি জিনিস মিলছে, কোনটি?', sw: 'Vitu kadhaa vinalingana, kipi?',
    fr: 'Plusieurs correspondances, laquelle ?', ar: 'هناك عدة نتائج, أيّها؟',
  },
  yesProduct: {
    en: 'Yes, {name}. {summary}', hi: 'हाँ, {name}। {summary}', bn: 'হ্যাঁ, {name}। {summary}',
    sw: 'Ndio, {name}. {summary}', fr: 'Oui, {name}. {summary}', ar: 'نعم, {name}. {summary}',
  },
  yesProductShort: {
    en: 'Yes, we have {name}. Retail {price}.',
    hi: 'हाँ, हमारे पास {name} है। खुदरा {price}।',
    bn: 'হ্যাঁ, আমাদের কাছে {name} আছে। খুচরা {price}।',
    sw: 'Ndio, tuna {name}. Rejareja {price}.',
    fr: 'Oui, nous avons {name}. Détail {price}.',
    ar: 'نعم, لدينا {name}. التجزئة {price}.',
  },
  stockUpdates: {
    en: 'Stock updates live as orders come in.',
    hi: 'ऑर्डर आने पर स्टॉक लाइव अपडेट होता है।',
    bn: 'অর্ডার এলে স্টক লাইভ আপডেট হয়।',
    sw: 'Hisa husasishwa moja kwa moja maagizo yanapoingia.',
    fr: 'Le stock est mis à jour en direct au fil des commandes.',
    ar: 'يتحدّث المخزون مباشرةً مع ورود الطلبات.',
  },
  stockSingle: {
    en: '{name}, {status}. Stock is shown live on the product page and updates as orders come in.',
    hi: '{name}, {status}। स्टॉक उत्पाद पेज पर लाइव दिखता है और ऑर्डर आने पर अपडेट होता है।',
    bn: '{name}, {status}। স্টক পণ্য পৃষ্ঠায় লাইভ দেখানো হয় এবং অর্ডার এলে আপডেট হয়।',
    sw: '{name}, {status}. Hisa huonyeshwa moja kwa moja kwenye ukurasa wa bidhaa na husasishwa maagizo yanapoingia.',
    fr: '{name}, {status}. Le stock est affiché en direct sur la page produit et se met à jour au fil des commandes.',
    ar: '{name}, {status}. يظهر المخزون مباشرةً في صفحة المنتج ويتحدّث مع ورود الطلبات.',
  },
  availOnRequest: {
    en: 'availability on request', hi: 'उपलब्धता अनुरोध पर', bn: 'প্রাপ্যতা অনুরোধসাপেক্ষে',
    sw: 'upatikanaji kwa ombi', fr: 'disponibilité sur demande', ar: 'التوفّر عند الطلب',
  },
  availIn: { en: 'In stock', hi: 'स्टॉक में', bn: 'স্টকে আছে', sw: 'Ipo hisani', fr: 'En stock', ar: 'متوفّر' },
  availLow: { en: 'Low stock', hi: 'कम स्टॉक', bn: 'কম স্টক', sw: 'Hisa kidogo', fr: 'Stock faible', ar: 'مخزون منخفض' },
  availOut: { en: 'Out of stock', hi: 'स्टॉक ख़त्म', bn: 'স্টক শেষ', sw: 'Imeisha', fr: 'Rupture de stock', ar: 'غير متوفّر' },
  moqIntro: {
    en: 'Wholesale minimums are per product:',
    hi: 'थोक न्यूनतम मात्रा हर उत्पाद के अनुसार है:',
    bn: 'পাইকারি ন্যূনতম পরিমাণ প্রতিটি পণ্যের জন্য আলাদা:',
    sw: 'Kiwango cha chini cha jumla ni kwa kila bidhaa:',
    fr: 'Les minimums de gros sont par produit :',
    ar: 'الحد الأدنى للجملة يكون لكل منتج:',
  },
  moqLine: {
    en: '• {names}, from {qty}', hi: '• {names}, {qty} से', bn: '• {names}, {qty} থেকে',
    sw: '• {names}, kuanzia {qty}', fr: '• {names}, à partir de {qty}', ar: '• {names}, ابتداءً من {qty}',
  },
  moqMix: {
    en: 'You can mix colours and sizes within the minimum. Open a product and switch to “Wholesale” to see its exact figure.',
    hi: 'न्यूनतम मात्रा के भीतर आप रंग और साइज़ मिला सकते हैं। किसी उत्पाद को खोलें और सटीक आँकड़ा देखने के लिए “थोक” पर स्विच करें।',
    bn: 'ন্যূনতম পরিমাণের মধ্যে আপনি রঙ ও সাইজ মিশাতে পারেন। একটি পণ্য খুলে সঠিক সংখ্যা দেখতে “পাইকারি”-তে যান।',
    sw: 'Unaweza kuchanganya rangi na saizi ndani ya kiwango cha chini. Fungua bidhaa na ubadilishe hadi “Jumla” kuona takwimu yake kamili.',
    fr: "Vous pouvez mélanger les couleurs et les tailles dans le minimum. Ouvrez un produit et passez en « Gros » pour voir son chiffre exact.",
    ar: 'يمكنك مزج الألوان والمقاسات ضمن الحد الأدنى. افتح منتجًا وبدّل إلى «الجملة» لرؤية رقمه الدقيق.',
  },

  /* ---- navigation ---- */
  navHere: { en: 'Here you go:', hi: 'यह रहा:', bn: 'এই যে:', sw: 'Karibu:', fr: 'Voici :', ar: 'تفضّل:' },
  navFew: {
    en: 'A few places that might be what you mean:',
    hi: 'कुछ जगहें जो शायद आपका मतलब हों:',
    bn: 'কয়েকটি জায়গা যা হয়তো আপনি বোঝাতে চাইছেন:',
    sw: 'Sehemu chache ambazo huenda ndizo unazomaanisha:',
    fr: 'Quelques pages qui pourraient correspondre :',
    ar: 'بعض الصفحات التي قد تقصدها:',
  },
  openProduct: {
    en: 'Open {name}', hi: '{name} खोलें', bn: '{name} খুলুন',
    sw: 'Fungua {name}', fr: 'Ouvrir {name}', ar: 'فتح {name}',
  },

  /* ---- chip labels (the send value stays English) ---- */
  chip_browse: {
    en: 'Browse the range', hi: 'रेंज देखें', bn: 'সম্পূর্ণ পরিসর দেখুন',
    sw: 'Vinjari bidhaa', fr: 'Voir la gamme', ar: 'تصفّح المجموعة',
  },
  chip_wholesale: {
    en: 'How does wholesale work?', hi: 'थोक कैसे काम करता है?', bn: 'পাইকারি কীভাবে কাজ করে?',
    sw: 'Jumla inafanyaje kazi?', fr: 'Comment fonctionne la vente en gros ?', ar: 'كيف يعمل البيع بالجملة؟',
  },
  chip_deliveryReturns: {
    en: 'Delivery & returns', hi: 'डिलीवरी और रिटर्न', bn: 'ডেলিভারি ও রিটার্ন',
    sw: 'Uwasilishaji na marejesho', fr: 'Livraison et retours', ar: 'التوصيل والإرجاع',
  },
  chip_talkPerson: {
    en: 'Talk to a person', hi: 'किसी व्यक्ति से बात करें', bn: 'একজন ব্যক্তির সাথে কথা বলুন',
    sw: 'Ongea na mtu', fr: 'Parler à une personne', ar: 'التحدث إلى شخص',
  },
  chip_whatSell: {
    en: 'What do you sell?', hi: 'आप क्या बेचते हैं?', bn: 'আপনি কী বিক্রি করেন?',
    sw: 'Mnauza nini?', fr: 'Que vendez-vous ?', ar: 'ماذا تبيعون؟',
  },
  chip_wholesaleMoq: {
    en: 'Wholesale & MOQ', hi: 'थोक और न्यूनतम मात्रा', bn: 'পাইকারি ও ন্যূনতম অর্ডার',
    sw: 'Jumla na kiwango cha chini', fr: 'Gros et quantité minimale', ar: 'الجملة والحد الأدنى',
  },
  chip_delivery: {
    en: 'Delivery', hi: 'डिलीवरी', bn: 'ডেলিভারি', sw: 'Uwasilishaji', fr: 'Livraison', ar: 'التوصيل',
  },
  chip_inStock: {
    en: 'Is it in stock?', hi: 'क्या यह स्टॉक में है?', bn: 'এটি কি স্টকে আছে?',
    sw: 'Ipo hisani?', fr: 'Est-ce en stock ?', ar: 'هل هو متوفّر؟',
  },
  chip_sizes: {
    en: 'What sizes?', hi: 'कौन-से साइज़?', bn: 'কী কী সাইজ?',
    sw: 'Saizi zipi?', fr: 'Quelles tailles ?', ar: 'ما المقاسات؟',
  },
  chip_priceWholesale: {
    en: 'Price & wholesale', hi: 'कीमत और थोक', bn: 'দাম ও পাইকারি',
    sw: 'Bei na jumla', fr: 'Prix et gros', ar: 'السعر والجملة',
  },
  chip_moq: {
    en: 'Minimum order quantities', hi: 'न्यूनतम ऑर्डर मात्रा', bn: 'ন্যূনতম অর্ডার পরিমাণ',
    sw: 'Viwango vya chini vya agizo', fr: 'Quantités minimales de commande', ar: 'كميات الطلب الدنيا',
  },
  chip_howWholesale: {
    en: 'How wholesale works', hi: 'थोक कैसे काम करता है', bn: 'পাইকারি যেভাবে কাজ করে',
    sw: 'Jinsi jumla inavyofanya kazi', fr: 'Comment marche le gros', ar: 'كيف تعمل الجملة',
  },
  chip_deliveryCost: {
    en: 'How much is delivery?', hi: 'डिलीवरी कितने की है?', bn: 'ডেলিভারি খরচ কত?',
    sw: 'Uwasilishaji ni bei gani?', fr: 'Combien coûte la livraison ?', ar: 'كم تكلفة التوصيل؟',
  },
  chip_deliveryTime: {
    en: 'How long does delivery take?', hi: 'डिलीवरी में कितना समय लगता है?', bn: 'ডেলিভারিতে কত সময় লাগে?',
    sw: 'Uwasilishaji huchukua muda gani?', fr: 'Quel est le délai de livraison ?', ar: 'كم يستغرق التوصيل؟',
  },
  chip_currency: {
    en: 'Currency & pricing', hi: 'मुद्रा और मूल्य', bn: 'মুদ্রা ও দাম',
    sw: 'Sarafu na bei', fr: 'Devise et prix', ar: 'العملة والتسعير',
  },
  chip_shopRange: {
    en: 'Shop the range', hi: 'रेंज खरीदें', bn: 'পরিসর থেকে কিনুন',
    sw: 'Nunua bidhaa', fr: 'Acheter la gamme', ar: 'تسوّق المجموعة',
  },

  /* ---- route labels (localised link text; the route is the key) ---- */
  'route_/wholesale': {
    en: 'How wholesale works', hi: 'थोक कैसे काम करता है', bn: 'পাইকারি কীভাবে কাজ করে',
    sw: 'Jinsi jumla inavyofanya kazi', fr: 'La vente en gros', ar: 'كيف تعمل الجملة',
  },
  'route_/wholesale/enquiry': {
    en: 'Open a trade account', hi: 'ट्रेड खाता खोलें', bn: 'ট্রেড অ্যাকাউন্ট খুলুন',
    sw: 'Fungua akaunti ya biashara', fr: 'Ouvrir un compte pro', ar: 'فتح حساب تجاري',
  },
  'route_/legal/shipping': {
    en: 'Shipping & delivery', hi: 'शिपिंग और डिलीवरी', bn: 'শিপিং ও ডেলিভারি',
    sw: 'Usafirishaji na uwasilishaji', fr: 'Expédition et livraison', ar: 'الشحن والتوصيل',
  },
  'route_/legal/returns': {
    en: 'Returns & refunds', hi: 'रिटर्न और रिफंड', bn: 'রিটার্ন ও রিফান্ড',
    sw: 'Marejesho na fidia', fr: 'Retours et remboursements', ar: 'الإرجاع والاسترداد',
  },
  'route_/legal/privacy': {
    en: 'Privacy & payments', hi: 'गोपनीयता और भुगतान', bn: 'গোপনীয়তা ও পেমেন্ট',
    sw: 'Faragha na malipo', fr: 'Confidentialité et paiements', ar: 'الخصوصية والمدفوعات',
  },
  'route_/legal/terms': {
    en: 'Terms & conditions', hi: 'नियम और शर्तें', bn: 'শর্তাবলী',
    sw: 'Vigezo na masharti', fr: 'Conditions générales', ar: 'الشروط والأحكام',
  },
  'route_/contact': {
    en: 'Contact us', hi: 'हमसे संपर्क करें', bn: 'যোগাযোগ করুন',
    sw: 'Wasiliana nasi', fr: 'Nous contacter', ar: 'اتصل بنا',
  },
  'route_/account': {
    en: 'Your account', hi: 'आपका खाता', bn: 'আপনার অ্যাকাউন্ট',
    sw: 'Akaunti yako', fr: 'Votre compte', ar: 'حسابك',
  },
  'route_/sign-in': {
    en: 'Sign in', hi: 'साइन इन करें', bn: 'সাইন ইন', sw: 'Ingia', fr: 'Se connecter', ar: 'تسجيل الدخول',
  },
  'route_/sign-up': {
    en: 'Create an account', hi: 'खाता बनाएँ', bn: 'অ্যাকাউন্ট তৈরি করুন',
    sw: 'Fungua akaunti', fr: 'Créer un compte', ar: 'إنشاء حساب',
  },
  'route_/about': {
    en: 'About AZRAA', hi: 'AZRAA के बारे में', bn: 'AZRAA সম্পর্কে',
    sw: 'Kuhusu AZRAA', fr: 'À propos d’AZRAA', ar: 'عن AZRAA',
  },
  'route_/shop': {
    en: 'Shop all', hi: 'सभी देखें', bn: 'সব দেখুন', sw: 'Nunua zote', fr: 'Tout voir', ar: 'تسوّق الكل',
  },
  'route_/shop/men': { en: 'Men', hi: 'पुरुष', bn: 'পুরুষ', sw: 'Wanaume', fr: 'Homme', ar: 'رجال' },
  'route_/shop/shoes': { en: 'Shoes', hi: 'जूते', bn: 'জুতা', sw: 'Viatu', fr: 'Chaussures', ar: 'أحذية' },
  'route_/shop/bags': { en: 'Bags', hi: 'बैग', bn: 'ব্যাগ', sw: 'Mikoba', fr: 'Sacs', ar: 'حقائب' },
  'route_/shop/ladies': { en: 'Ladies', hi: 'महिलाएँ', bn: 'নারী', sw: 'Wanawake', fr: 'Femme', ar: 'نساء' },
  'route_/cart': { en: 'Your bag', hi: 'आपका बैग', bn: 'আপনার ব্যাগ', sw: 'Kikapu chako', fr: 'Votre panier', ar: 'سلّتك' },
};

/** t('hi', 'greeting', { region: '...' }), falls back to English, then the key. */
export function t(lang, key, vars) {
  const row = S[key] || {};
  let str = row[lang] ?? row.en ?? key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.split(`{${k}}`).join(vars[k] == null ? '' : String(vars[k]));
    }
  }
  return str;
}

/** localised label for a route link */
export const routeLabel = (lang, to) => t(lang, `route_${to}`);
