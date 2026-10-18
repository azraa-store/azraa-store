// Curated knowledge base for the AZRAA assistant. Kept in sync with the legal
// documents, the wholesale page and the logistics config.
//
// `answer` is keyed by language code. English is authoritative; the other five
// are a first pass, have a native speaker review the policy answers (returns,
// shipping, payment, terms) before launch. `keywords` stay English: the rule
// engine routes on them, and chip `send` values are English too.

export const FAQS = [
  {
    id: 'wholesale-how',
    topic: 'Wholesale',
    keywords: ['wholesale', 'bulk', 'trade', 'reseller', 'distributor', 'moq', 'minimum order', 'minimum quantity', 'buy in bulk', 'retailer'],
    answer: {
      en: 'Wholesale is a direct purchase, no enquiry or quote needed for standard orders. Open any product, switch to “Wholesale”, enter a quantity at or above its minimum, and check out at the wholesale unit price. Every product in the store carries both a retail and a wholesale price.',
      hi: 'थोक एक सीधी खरीद है, मानक ऑर्डर के लिए कोई पूछताछ या कोटेशन ज़रूरी नहीं। किसी भी उत्पाद को खोलें, “थोक” पर स्विच करें, न्यूनतम या उससे अधिक मात्रा डालें, और थोक यूनिट कीमत पर चेकआउट करें। स्टोर के हर उत्पाद की खुदरा और थोक दोनों कीमतें हैं।',
      bn: 'পাইকারি একটি সরাসরি কেনা, সাধারণ অর্ডারের জন্য কোনো জিজ্ঞাসা বা কোটেশন লাগে না। যেকোনো পণ্য খুলুন, “পাইকারি”-তে যান, ন্যূনতম বা তার বেশি পরিমাণ দিন, এবং পাইকারি একক দামে চেকআউট করুন। স্টোরের প্রতিটি পণ্যের খুচরা ও পাইকারি দুটি দামই আছে।',
      sw: 'Jumla ni ununuzi wa moja kwa moja, hakuna ulizo au nukuu inayohitajika kwa maagizo ya kawaida. Fungua bidhaa yoyote, badilisha hadi “Jumla”, weka kiasi sawa au zaidi ya kiwango cha chini, na ukamilishe malipo kwa bei ya jumla ya kipande. Kila bidhaa dukani ina bei ya rejareja na ya jumla.',
      fr: "Le gros est un achat direct, aucune demande ni devis pour les commandes standard. Ouvrez un produit, passez en « Gros », saisissez une quantité au moins égale au minimum, et payez au prix de gros unitaire. Chaque produit a un prix de détail et un prix de gros.",
      ar: 'البيع بالجملة عملية شراء مباشرة, لا حاجة إلى استفسار أو عرض سعر للطلبات العادية. افتح أي منتج، وبدّل إلى «الجملة»، وأدخل كمية تساوي الحد الأدنى أو أكثر، وأتمّ الشراء بسعر الوحدة بالجملة. كل منتج في المتجر له سعر تجزئة وسعر جملة.',
    },
    links: [
      { label: 'How wholesale works', to: '/wholesale' },
      { label: 'Open a trade account', to: '/wholesale/enquiry' },
    ],
  },
  {
    id: 'trade-account',
    topic: 'Trade accounts',
    keywords: ['trade account', 'account terms', 'net terms', 'credit terms', 'tiered pricing', 'custom pricing', 'large order', 'container', 'invoice'],
    answer: {
      en: 'For customer-specific pricing, payment terms or large recurring orders, open a trade account. Standard wholesale orders don’t need one, you can buy at the listed wholesale price straight away.',
      hi: 'ग्राहक-विशिष्ट कीमत, भुगतान शर्तों या बड़े नियमित ऑर्डर के लिए ट्रेड खाता खोलें। मानक थोक ऑर्डर के लिए इसकी ज़रूरत नहीं, आप सूचीबद्ध थोक कीमत पर तुरंत खरीद सकते हैं।',
      bn: 'গ্রাহক-নির্দিষ্ট দাম, পেমেন্ট শর্ত বা বড় নিয়মিত অর্ডারের জন্য ট্রেড অ্যাকাউন্ট খুলুন। সাধারণ পাইকারি অর্ডারে এটির দরকার নেই, আপনি তালিকাভুক্ত পাইকারি দামে এখনই কিনতে পারেন।',
      sw: 'Kwa bei maalum ya mteja, masharti ya malipo au maagizo makubwa ya mara kwa mara, fungua akaunti ya biashara. Maagizo ya kawaida ya jumla hayahitaji, unaweza kununua kwa bei ya jumla iliyoorodheshwa mara moja.',
      fr: "Pour des prix personnalisés, des conditions de paiement ou de grandes commandes récurrentes, ouvrez un compte pro. Les commandes de gros standard n'en ont pas besoin, vous achetez au prix de gros affiché immédiatement.",
      ar: 'للحصول على أسعار خاصة بالعميل أو شروط دفع أو طلبات كبيرة متكررة، افتح حسابًا تجاريًا. الطلبات العادية بالجملة لا تحتاج إلى ذلك, يمكنك الشراء بسعر الجملة المعروض مباشرةً.',
    },
    links: [{ label: 'Open a trade account', to: '/wholesale/enquiry' }],
  },
  {
    id: 'shipping',
    topic: 'Shipping & delivery',
    keywords: ['shipping', 'delivery', 'deliver', 'ship', 'dispatch', 'how long', 'lead time', 'arrive', 'courier', 'freight', 'tracking', 'track'],
    answer: {
      en: 'Orders ship to the country you select at checkout, tracked courier for retail, consolidated freight for wholesale. Retail delivery is typically 5–9 working days standard, or 2–4 on express. Wholesale and export lead times are quoted per order. A tracking reference is emailed on dispatch and shown in your account.',
      hi: 'ऑर्डर उसी देश में भेजे जाते हैं जो आप चेकआउट पर चुनते हैं, खुदरा के लिए ट्रैक्ड कूरियर, थोक के लिए समेकित माल-ढुलाई। खुदरा डिलीवरी आमतौर पर 5–9 कार्यदिवस मानक, या एक्सप्रेस पर 2–4 दिन। थोक और निर्यात समय हर ऑर्डर पर बताया जाता है। भेजते समय ट्रैकिंग संदर्भ ईमेल किया जाता है और आपके खाते में दिखता है।',
      bn: 'চেকআউটে আপনি যে দেশ নির্বাচন করেন সেখানেই অর্ডার পাঠানো হয়, খুচরার জন্য ট্র্যাকড কুরিয়ার, পাইকারির জন্য সমন্বিত ফ্রেইট। খুচরা ডেলিভারি সাধারণত ৫–৯ কর্মদিবস, বা এক্সপ্রেসে ২–৪ দিন। পাইকারি ও রপ্তানির সময় প্রতিটি অর্ডারে জানানো হয়। পাঠানোর সময় একটি ট্র্যাকিং রেফারেন্স ইমেল করা হয় এবং আপনার অ্যাকাউন্টে দেখা যায়।',
      sw: 'Maagizo husafirishwa hadi nchi unayochagua wakati wa malipo, kwa rejareja ni kozi inayofuatiliwa, kwa jumla ni mizigo iliyounganishwa. Uwasilishaji wa rejareja kwa kawaida ni siku 5–9 za kazi, au 2–4 kwa haraka. Muda wa jumla na wa nje ya nchi hutolewa kwa kila agizo. Kumbukumbu ya ufuatiliaji hutumwa kwa barua pepe wakati wa kutuma na huonyeshwa kwenye akaunti yako.',
      fr: "Les commandes sont expédiées vers le pays choisi au paiement, coursier suivi pour le détail, fret groupé pour le gros. La livraison au détail prend généralement 5 à 9 jours ouvrés en standard, ou 2 à 4 en express. Les délais gros et export sont indiqués par commande. Un numéro de suivi est envoyé par e-mail à l'expédition et affiché dans votre compte.",
      ar: 'تُشحن الطلبات إلى البلد الذي تختاره عند الدفع, شحن مُتتبَّع للتجزئة، وشحن مُجمَّع للجملة. توصيل التجزئة عادةً من 5 إلى 9 أيام عمل قياسيًا، أو من 2 إلى 4 في الشحن السريع. تُحدَّد مدد الجملة والتصدير لكل طلب. يُرسَل رقم تتبّع بالبريد الإلكتروني عند الشحن ويظهر في حسابك.',
    },
    links: [{ label: 'Shipping & delivery', to: '/legal/shipping' }],
  },
  {
    id: 'delivery-cost',
    topic: 'Delivery charge',
    keywords: ['delivery cost', 'delivery charge', 'delivery fee', 'shipping cost', 'shipping fee', 'shipping charge', 'postage', 'how much is delivery', 'how much is shipping', 'free shipping', 'free delivery'],
    answer: {
      en: 'Delivery is a flat charge per order, ₹40 (about $0.44) for retail and ₹30 (about $0.33) for wholesale, shown in your local currency at checkout. Express adds a surcharge. Cross-border duties, where they apply, are the buyer’s responsibility unless a quote says otherwise.',
      hi: 'डिलीवरी हर ऑर्डर पर एक निश्चित शुल्क है, खुदरा के लिए ₹40 (लगभग $0.44) और थोक के लिए ₹30 (लगभग $0.33), चेकआउट पर आपकी स्थानीय मुद्रा में दिखता है। एक्सप्रेस पर अतिरिक्त शुल्क लगता है। सीमा-पार शुल्क, जहाँ लागू हो, खरीदार की ज़िम्मेदारी है जब तक कोटेशन में अन्यथा न कहा हो।',
      bn: 'ডেলিভারি প্রতি অর্ডারে একটি নির্দিষ্ট চার্জ, খুচরার জন্য ₹৪০ (প্রায় $০.৪৪) এবং পাইকারির জন্য ₹৩০ (প্রায় $০.৩৩), চেকআউটে আপনার স্থানীয় মুদ্রায় দেখানো হয়। এক্সপ্রেসে অতিরিক্ত চার্জ লাগে। সীমান্ত-পার শুল্ক, যেখানে প্রযোজ্য, কোটেশনে অন্যথা না বলা থাকলে ক্রেতার দায়িত্ব।',
      sw: 'Uwasilishaji ni malipo ya kudumu kwa kila agizo, ₹40 (takriban $0.44) kwa rejareja na ₹30 (takriban $0.33) kwa jumla, huonyeshwa kwa sarafu yako wakati wa malipo. Haraka huongeza malipo ya ziada. Ushuru wa mpakani, pale unapotumika, ni jukumu la mnunuzi isipokuwa nukuu iseme vinginevyo.',
      fr: "La livraison est un forfait par commande, 40 ₹ (environ 0,44 $) pour le détail et 30 ₹ (environ 0,33 $) pour le gros, affiché dans votre devise au paiement. L'express ajoute un supplément. Les droits de douane éventuels sont à la charge de l'acheteur, sauf mention contraire dans un devis.",
      ar: 'التوصيل رسم ثابت لكل طلب, ₹40 (نحو 0.44$) للتجزئة و₹30 (نحو 0.33$) للجملة، ويظهر بعملتك المحلية عند الدفع. الشحن السريع يضيف رسمًا إضافيًا. الرسوم الجمركية عبر الحدود، حيثما تنطبق، مسؤولية المشتري ما لم يُذكر خلاف ذلك في عرض السعر.',
    },
    links: [{ label: 'Shipping & delivery', to: '/legal/shipping' }],
  },
  {
    id: 'returns',
    topic: 'Returns & refunds',
    keywords: ['return', 'returns', 'refund', 'refunds', 'exchange', 'send back', 'money back', 'cancel order', 'wrong size', 'faulty', 'damaged', 'defective'],
    answer: {
      en: 'Unworn retail items with tags can be returned within 14 days of delivery for a refund to your original payment method. For anything faulty or incorrectly supplied, contact us with your order number and a photo and we’ll arrange a replacement or refund. Wholesale returns are handled under your account terms.',
      hi: 'बिना पहने, टैग लगे खुदरा आइटम डिलीवरी के 14 दिन के भीतर लौटाए जा सकते हैं, रिफंड आपके मूल भुगतान माध्यम में होगा। किसी भी दोषपूर्ण या गलत भेजी गई वस्तु के लिए, अपना ऑर्डर नंबर और फ़ोटो के साथ हमसे संपर्क करें और हम बदलाव या रिफंड की व्यवस्था करेंगे। थोक रिटर्न आपके खाता शर्तों के अनुसार होते हैं।',
      bn: 'না পরা, ট্যাগযুক্ত খুচরা পণ্য ডেলিভারির ১৪ দিনের মধ্যে ফেরত দেওয়া যায়, রিফান্ড আপনার মূল পেমেন্ট মাধ্যমে যাবে। ত্রুটিপূর্ণ বা ভুল পাঠানো কিছুর জন্য, আপনার অর্ডার নম্বর ও ছবি দিয়ে যোগাযোগ করুন, আমরা প্রতিস্থাপন বা রিফান্ডের ব্যবস্থা করব। পাইকারি রিটার্ন আপনার অ্যাকাউন্ট শর্ত অনুযায়ী হয়।',
      sw: 'Bidhaa za rejareja zisizovaliwa zenye lebo zinaweza kurejeshwa ndani ya siku 14 baada ya kupokea kwa fidia kwa njia yako ya awali ya malipo. Kwa kitu chenye hitilafu au kilichotumwa vibaya, wasiliana nasi ukiwa na nambari ya agizo na picha, nasi tutapanga ubadilishaji au fidia. Marejesho ya jumla hushughulikiwa kulingana na masharti ya akaunti yako.',
      fr: "Les articles de détail non portés avec étiquettes peuvent être retournés dans les 14 jours suivant la livraison, pour un remboursement sur le moyen de paiement d'origine. Pour tout article défectueux ou mal fourni, contactez-nous avec votre numéro de commande et une photo, et nous organiserons un remplacement ou un remboursement. Les retours de gros sont régis par les conditions de votre compte.",
      ar: 'يمكن إرجاع منتجات التجزئة غير المستخدَمة والتي تحمل بطاقاتها خلال 14 يومًا من التسليم، مع استرداد المبلغ إلى وسيلة الدفع الأصلية. لأي منتج معيب أو مُرسَل بالخطأ، تواصل معنا برقم طلبك وصورة وسنرتّب استبدالًا أو استردادًا. تُعالَج مرتجعات الجملة وفق شروط حسابك.',
    },
    links: [
      { label: 'Returns & refunds', to: '/legal/returns' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    id: 'payment',
    topic: 'Payment',
    keywords: ['payment', 'pay', 'card', 'checkout', 'paypal', 'razorpay', 'paystack', 'flutterwave', 'how do i pay', 'payment method', 'accepted cards'],
    answer: {
      en: 'Payment methods depend on your region, Razorpay in India, Paystack and Flutterwave across Africa, and PayPal internationally. Card and payment details are handled entirely by the payment provider; AZRAA never stores full card numbers.',
      hi: 'भुगतान के तरीके आपके क्षेत्र पर निर्भर करते हैं, भारत में Razorpay, अफ़्रीका में Paystack और Flutterwave, और अंतरराष्ट्रीय स्तर पर PayPal। कार्ड और भुगतान विवरण पूरी तरह भुगतान प्रदाता संभालता है; AZRAA कभी पूरे कार्ड नंबर संग्रहीत नहीं करता।',
      bn: 'পেমেন্ট পদ্ধতি আপনার অঞ্চলের উপর নির্ভর করে, ভারতে Razorpay, আফ্রিকায় Paystack ও Flutterwave, এবং আন্তর্জাতিকভাবে PayPal। কার্ড ও পেমেন্টের তথ্য সম্পূর্ণভাবে পেমেন্ট প্রদানকারী পরিচালনা করে; AZRAA কখনও সম্পূর্ণ কার্ড নম্বর সংরক্ষণ করে না।',
      sw: 'Njia za malipo hutegemea eneo lako, Razorpay nchini India, Paystack na Flutterwave barani Afrika, na PayPal kimataifa. Maelezo ya kadi na malipo hushughulikiwa kabisa na mtoa huduma wa malipo; AZRAA hahifadhi kamwe nambari kamili za kadi.',
      fr: "Les moyens de paiement dépendent de votre région, Razorpay en Inde, Paystack et Flutterwave en Afrique, et PayPal à l'international. Les informations de carte et de paiement sont gérées entièrement par le prestataire de paiement ; AZRAA ne stocke jamais les numéros de carte complets.",
      ar: 'تعتمد طرق الدفع على منطقتك, Razorpay في الهند، وPaystack وFlutterwave في أنحاء أفريقيا، وPayPal دوليًا. تُعالَج بيانات البطاقة والدفع بالكامل لدى مزوّد الدفع؛ ولا تحتفظ AZRAA أبدًا بأرقام البطاقات كاملة.',
    },
    links: [{ label: 'Privacy & payments', to: '/legal/privacy' }],
  },
  {
    id: 'currency',
    topic: 'Currency & pricing',
    keywords: ['currency', 'exchange rate', 'usd', 'inr', 'rupees', 'naira', 'which currency', 'change currency', 'price in my currency', 'indicative price', 'conversion'],
    answer: {
      en: 'Prices show in the currency of the country you pick (top-right selector). India sees exact rupee prices; the United States sees US dollars; everywhere else is converted live from USD. Where a figure is marked indicative it’s an estimate, the payment provider confirms the exact local amount at checkout.',
      hi: 'कीमतें उस देश की मुद्रा में दिखती हैं जो आप चुनते हैं (ऊपर-दाईं ओर सिलेक्टर)। भारत में सटीक रुपये की कीमतें; अमेरिका में अमेरिकी डॉलर; बाकी सब जगह USD से लाइव रूपांतरित। जहाँ आँकड़ा “सांकेतिक” लिखा हो वह एक अनुमान है, भुगतान प्रदाता चेकआउट पर सटीक स्थानीय राशि की पुष्टि करता है।',
      bn: 'দাম আপনার বেছে নেওয়া দেশের মুদ্রায় দেখানো হয় (উপরে-ডানে সিলেক্টর)। ভারত সঠিক রুপির দাম দেখে; যুক্তরাষ্ট্র মার্কিন ডলার দেখে; বাকি সব জায়গায় USD থেকে লাইভ রূপান্তরিত। যেখানে সংখ্যা “নির্দেশক” লেখা, তা একটি অনুমান, পেমেন্ট প্রদানকারী চেকআউটে সঠিক স্থানীয় পরিমাণ নিশ্চিত করে।',
      sw: 'Bei huonyeshwa kwa sarafu ya nchi unayochagua (kiteuzi kilicho juu kulia). India huona bei kamili za rupia; Marekani huona dola za Marekani; kila mahali pengine hubadilishwa moja kwa moja kutoka USD. Pale takwimu inapowekwa alama ya “kadirio”, ni makisio, mtoa huduma wa malipo huthibitisha kiasi kamili cha ndani wakati wa malipo.',
      fr: "Les prix s'affichent dans la devise du pays choisi (sélecteur en haut à droite). L'Inde voit des prix exacts en roupies ; les États-Unis en dollars ; partout ailleurs, conversion en direct depuis l'USD. Lorsqu'un montant est marqué indicatif, c'est une estimation, le prestataire de paiement confirme le montant local exact au paiement.",
      ar: 'تظهر الأسعار بعملة البلد الذي تختاره (المُحدِّد أعلى اليمين). تشاهد الهند أسعارًا دقيقة بالروبية؛ وتشاهد الولايات المتحدة الدولار؛ وكل مكان آخر يُحوَّل مباشرةً من الدولار. حيثما وُضِع على الرقم وصف «تقريبي» فهو تقدير, يؤكّد مزوّد الدفع المبلغ المحلي الدقيق عند الدفع.',
    },
  },
  {
    id: 'sizing',
    topic: 'Sizing & fit',
    keywords: ['size', 'sizing', 'fit', 'fits', 'true to size', 'size chart', 'size guide', 'measurements', 'what size', 'run small', 'run large', 'uk size', 'eu size'],
    answer: {
      en: 'Every product page has a “Fit & sizing” note. As a guide: the tees and singlets are a regular fit and true to size (size up for a looser drape). Leather shoes are true to size with half sizes rounding up; the canvas sneaker runs slightly narrow. Sandals use EU sizing, size down if you’re between sizes.',
      hi: 'हर उत्पाद पेज पर “फ़िट और साइज़िंग” नोट है। मार्गदर्शन: टीज़ और सिंगलेट रेगुलर फ़िट और साइज़ के अनुसार सही (ढीले लुक के लिए एक साइज़ बड़ा लें)। लेदर जूते साइज़ के अनुसार सही, आधे साइज़ ऊपर की ओर; कैनवस स्नीकर थोड़ा संकरा। सैंडल EU साइज़िंग, दो साइज़ के बीच हों तो छोटा लें।',
      bn: 'প্রতিটি পণ্য পৃষ্ঠায় “ফিট ও সাইজিং” নোট আছে। নির্দেশিকা: টি ও সিঙ্গলেট রেগুলার ফিট এবং সাইজ অনুযায়ী সঠিক (ঢিলা লুকের জন্য এক সাইজ বড় নিন)। চামড়ার জুতা সাইজ অনুযায়ী সঠিক, হাফ সাইজ উপরের দিকে; ক্যানভাস স্নিকার একটু সরু। স্যান্ডেল EU সাইজিং, দুই সাইজের মাঝে হলে ছোটটি নিন।',
      sw: 'Kila ukurasa wa bidhaa una dokezo la “Ukubwa na jinsi inavyokaa”. Kama mwongozo: fulana na visketi ni ukaaji wa kawaida na sawa na ukubwa (chukua ukubwa juu kwa mvuto huru). Viatu vya ngozi ni sawa na ukubwa, nusu ukubwa hupanda juu; kiatu cha kanvasi ni chembamba kidogo. Kandambili hutumia ukubwa wa EU, shuka ukubwa ikiwa upo katikati ya ukubwa mbili.',
      fr: "Chaque page produit a une note « Coupe et taille ». En repère : les tee-shirts et débardeurs sont coupe droite et taillent normalement (prenez une taille au-dessus pour un tombé plus ample). Les chaussures en cuir taillent normalement, les demi-pointures s'arrondissant au-dessus ; la basket en toile taille un peu étroit. Les sandales sont en pointures EU, prenez en dessous si vous êtes entre deux tailles.",
      ar: 'كل صفحة منتج تحتوي ملاحظة «القَصّة والمقاس». كدليل: القمصان والفانلات قَصّة عادية ومطابقة للمقاس (اختر مقاسًا أكبر لإطلالة أوسع). الأحذية الجلدية مطابقة للمقاس مع تقريب أنصاف المقاسات للأعلى؛ حذاء الكانفاس ضيّق قليلًا. الصنادل بمقاسات أوروبية, اختر مقاسًا أصغر إذا كنت بين مقاسين.',
    },
  },
  {
    id: 'stock',
    topic: 'Stock & availability',
    keywords: ['stock', 'in stock', 'out of stock', 'available', 'availability', 'sold out', 'restock', 'back in stock', 'when will you have'],
    answer: {
      en: 'Stock is shown live on each product page and updates automatically as orders are placed. Full colour and size runs are held for wholesale. If a variant is out, check back, or message us and we’ll tell you the next run.',
      hi: 'हर उत्पाद पेज पर स्टॉक लाइव दिखता है और ऑर्डर होने पर अपने-आप अपडेट होता है। थोक के लिए पूरे रंग और साइज़ रेंज रखे जाते हैं। कोई वैरिएंट न हो तो फिर से देखें, या हमें संदेश करें, हम अगली रन बताएँगे।',
      bn: 'প্রতিটি পণ্য পৃষ্ঠায় স্টক লাইভ দেখানো হয় এবং অর্ডার হলে স্বয়ংক্রিয়ভাবে আপডেট হয়। পাইকারির জন্য সম্পূর্ণ রঙ ও সাইজ পরিসর রাখা হয়। কোনো ভ্যারিয়েন্ট শেষ হলে পরে দেখুন, বা আমাদের বার্তা দিন, আমরা পরের ব্যাচ জানাব।',
      sw: 'Hisa huonyeshwa moja kwa moja kwenye kila ukurasa wa bidhaa na husasishwa kiotomatiki maagizo yanapowekwa. Rangi na saizi kamili huhifadhiwa kwa jumla. Ikiwa aina fulani imeisha, angalia tena, au tutumie ujumbe nasi tutakuambia kundi lijalo.',
      fr: "Le stock est affiché en direct sur chaque page produit et se met à jour automatiquement au fur et à mesure des commandes. Les gammes complètes de couleurs et de tailles sont réservées au gros. Si une variante est épuisée, revenez plus tard, ou écrivez-nous et nous vous indiquerons le prochain réassort.",
      ar: 'يظهر المخزون مباشرةً في كل صفحة منتج ويتحدّث تلقائيًا مع تقديم الطلبات. تُحفَظ تشكيلات الألوان والمقاسات الكاملة للجملة. إذا نفد أحد الخيارات، تحقّق لاحقًا, أو راسلنا وسنخبرك بالدفعة التالية.',
    },
  },
  {
    id: 'order-help',
    topic: 'Your order',
    keywords: ['my order', 'order status', 'where is my order', 'order number', 'change my order', 'update order', 'order confirmation', 'didnt get', 'did not receive'],
    answer: {
      en: 'Your orders, with status and tracking, live in your account under “Orders”. I can’t look up a specific order from here, but if something’s wrong, message us with your order number and we’ll sort it.',
      hi: 'आपके ऑर्डर, स्थिति और ट्रैकिंग के साथ, आपके खाते में “ऑर्डर” के अंतर्गत हैं। मैं यहाँ से कोई विशेष ऑर्डर नहीं देख सकता, लेकिन कुछ गड़बड़ हो तो अपना ऑर्डर नंबर के साथ हमें संदेश करें और हम ठीक कर देंगे।',
      bn: 'আপনার অর্ডার, স্ট্যাটাস ও ট্র্যাকিং সহ, আপনার অ্যাকাউন্টে “Orders”-এ আছে। আমি এখান থেকে নির্দিষ্ট অর্ডার দেখতে পারি না, তবে কিছু ভুল হলে আপনার অর্ডার নম্বর দিয়ে আমাদের বার্তা দিন, আমরা ঠিক করে দেব।',
      sw: 'Maagizo yako, pamoja na hali na ufuatiliaji, yapo kwenye akaunti yako chini ya “Orders”. Siwezi kutafuta agizo mahususi kutoka hapa, lakini kama kuna tatizo, tutumie ujumbe ukiwa na nambari ya agizo nasi tutalitatua.',
      fr: "Vos commandes, avec statut et suivi, se trouvent dans votre compte sous « Commandes ». Je ne peux pas consulter une commande précise ici, mais si quelque chose ne va pas, écrivez-nous avec votre numéro de commande et nous réglerons cela.",
      ar: 'طلباتك, مع الحالة والتتبّع, موجودة في حسابك ضمن «Orders». لا يمكنني البحث عن طلب محدّد من هنا، لكن إذا كان هناك خطأ، راسلنا برقم طلبك وسنحلّه.',
    },
    links: [
      { label: 'Your orders', to: '/account' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    id: 'account',
    topic: 'Accounts',
    keywords: ['account', 'sign in', 'log in', 'login', 'register', 'sign up', 'create account', 'password', 'reset password', 'forgot password', 'my details', 'address book'],
    answer: {
      en: 'You can browse and check out without an account, but signing in keeps your orders, addresses and (for wholesale) your company details in one place.',
      hi: 'आप बिना खाते के ब्राउज़ और चेकआउट कर सकते हैं, लेकिन साइन इन करने से आपके ऑर्डर, पते और (थोक के लिए) आपकी कंपनी विवरण एक जगह रहते हैं।',
      bn: 'অ্যাকাউন্ট ছাড়াই আপনি ব্রাউজ ও চেকআউট করতে পারেন, তবে সাইন ইন করলে আপনার অর্ডার, ঠিকানা এবং (পাইকারির জন্য) কোম্পানির তথ্য এক জায়গায় থাকে।',
      sw: 'Unaweza kuvinjari na kukamilisha malipo bila akaunti, lakini kuingia huhifadhi maagizo yako, anwani na (kwa jumla) maelezo ya kampuni yako mahali pamoja.',
      fr: "Vous pouvez naviguer et payer sans compte, mais la connexion regroupe vos commandes, vos adresses et (pour le gros) les informations de votre entreprise au même endroit.",
      ar: 'يمكنك التصفّح والدفع دون حساب، لكن تسجيل الدخول يحفظ طلباتك وعناوينك و(للجملة) بيانات شركتك في مكان واحد.',
    },
    links: [
      { label: 'Sign in', to: '/sign-in' },
      { label: 'Create an account', to: '/sign-up' },
    ],
  },
  {
    id: 'company',
    topic: 'About AZRAA',
    keywords: ['about', 'who are you', 'what is azraa', 'company', 'where are you based', 'brand', 'story', 'azraa bot'],
    answer: {
      en: 'AZRAA is a wholesale-focused commerce company supplying clothing, footwear and accessories across Asia and Africa, with staple foods planned next. The idea is simple: buy well, hold real stock, price to volume, and make purchasing straightforward whether the order is one piece or a full container. I’m AZRAA, here to help you find products, understand pricing and get through checkout.',
      hi: 'AZRAA एक थोक-केंद्रित वाणिज्य कंपनी है जो एशिया और अफ़्रीका में कपड़े, जूते और सहायक सामान की आपूर्ति करती है, आगे बुनियादी खाद्य पदार्थों की योजना है। विचार सरल है: अच्छा खरीदो, असली स्टॉक रखो, मात्रा के अनुसार कीमत लगाओ, और खरीदारी को आसान बनाओ चाहे ऑर्डर एक पीस हो या पूरा कंटेनर। मैं AZRAA हूँ, उत्पाद खोजने, कीमत समझने और चेकआउट में मदद के लिए।',
      bn: 'AZRAA একটি পাইকারি-কেন্দ্রিক বাণিজ্য কোম্পানি যা এশিয়া ও আফ্রিকা জুড়ে পোশাক, জুতা ও অনুষঙ্গ সরবরাহ করে, পরবর্তীতে মূল খাদ্যপণ্যের পরিকল্পনা আছে। ধারণাটি সহজ: ভালো কেনা, প্রকৃত স্টক রাখা, পরিমাণ অনুযায়ী দাম, এবং অর্ডার এক পিস হোক বা পুরো কনটেইনার, কেনাকাটা সহজ রাখা। আমি AZRAA, পণ্য খুঁজতে, দাম বুঝতে এবং চেকআউটে সাহায্যের জন্য।',
      sw: 'AZRAA ni kampuni ya biashara inayolenga jumla, ikitoa mavazi, viatu na vifaa kote Asia na Afrika, huku vyakula vya msingi vikipangwa baadaye. Wazo ni rahisi: nunua vizuri, weka hisa halisi, panga bei kulingana na wingi, na fanya ununuzi uwe rahisi iwe agizo ni kipande kimoja au kontena kamili. Mimi ni AZRAA, hapa kukusaidia kupata bidhaa, kuelewa bei na kukamilisha malipo.',
      fr: "AZRAA est une entreprise de commerce axée sur le gros, fournissant vêtements, chaussures et accessoires en Asie et en Afrique, avec des denrées de base prévues ensuite. L'idée est simple : bien acheter, tenir un vrai stock, fixer les prix au volume, et rendre l'achat simple, que la commande soit d'une pièce ou d'un conteneur entier. Je suis AZRAA, là pour vous aider à trouver des produits, comprendre les prix et passer commande.",
      ar: 'AZRAA شركة تجارة تركّز على البيع بالجملة، تورّد الملابس والأحذية والإكسسوارات في آسيا وأفريقيا، مع خطة لإضافة المواد الغذائية الأساسية لاحقًا. الفكرة بسيطة: اشترِ جيدًا، واحتفظ بمخزون حقيقي، وسعّر حسب الكمية، واجعل الشراء سهلًا سواء كان الطلب قطعة واحدة أو حاوية كاملة. أنا AZRAA، هنا لمساعدتك في إيجاد المنتجات وفهم الأسعار وإتمام الشراء.',
    },
    links: [{ label: 'About AZRAA', to: '/about' }],
  },
  {
    id: 'categories',
    topic: 'What we sell',
    keywords: ['what do you sell', 'what do you have', 'categories', 'product range', 'catalogue', 'catalog', 'collections', 'range'],
    answer: {
      en: 'Four lines right now: Men (tees and singlets), Shoes (leather shoes, canvas sneakers and sandals), Bags (cross-body slings), and Ladies (leather bags). Food is planned but not live yet.',
      hi: 'अभी चार लाइनें: पुरुष (टीज़ और सिंगलेट), जूते (लेदर जूते, कैनवस स्नीकर और सैंडल), बैग (क्रॉस-बॉडी स्लिंग), और महिलाएँ (लेदर बैग)। खाद्य पदार्थ योजना में हैं पर अभी लाइव नहीं।',
      bn: 'এখন চারটি লাইন: পুরুষ (টি ও সিঙ্গলেট), জুতা (চামড়ার জুতা, ক্যানভাস স্নিকার ও স্যান্ডেল), ব্যাগ (ক্রস-বডি স্লিং), এবং নারী (চামড়ার ব্যাগ)। খাদ্য পরিকল্পনায় আছে তবে এখনও লাইভ নয়।',
      sw: 'Kwa sasa mistari minne: Wanaume (fulana na visketi), Viatu (viatu vya ngozi, sneaker za kanvasi na kandambili), Mikoba (mikoba ya mshipi), na Wanawake (mikoba ya ngozi). Chakula kimepangwa lakini bado hakijaanza.',
      fr: "Quatre lignes pour l'instant : Homme (tee-shirts et débardeurs), Chaussures (cuir, baskets en toile et sandales), Sacs (sacs bandoulière), et Femme (sacs en cuir). L'alimentaire est prévu mais pas encore en ligne.",
      ar: 'أربعة خطوط حاليًا: رجال (قمصان وفانلات)، أحذية (أحذية جلدية وأحذية كانفاس وصنادل)، حقائب (حقائب كتف)، ونساء (حقائب جلدية). المواد الغذائية مخطّطة لكنها لم تُطلَق بعد.',
    },
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
    answer: {
      en: 'Happy to hand you over. The quickest way to reach a person is WhatsApp, otherwise the contact form gets you the wholesale desk or customer care.',
      hi: 'ख़ुशी से आगे भेज देता हूँ। किसी व्यक्ति तक पहुँचने का सबसे तेज़ तरीका WhatsApp है, या संपर्क फ़ॉर्म से आप थोक डेस्क या ग्राहक सेवा तक पहुँचते हैं।',
      bn: 'সানন্দে হস্তান্তর করছি। একজন ব্যক্তির সাথে যোগাযোগের দ্রুততম উপায় WhatsApp, অথবা যোগাযোগ ফর্মে আপনি পাইকারি ডেস্ক বা গ্রাহক সেবা পাবেন।',
      sw: 'Nafurahi kukukabidhi. Njia ya haraka zaidi ya kufikia mtu ni WhatsApp, vinginevyo fomu ya mawasiliano hukufikisha kwa dawati la jumla au huduma kwa wateja.',
      fr: "Avec plaisir, je vous transfère. Le plus rapide pour joindre une personne est WhatsApp, sinon le formulaire de contact vous met en relation avec le service gros ou le service client.",
      ar: 'يسعدني تحويلك. أسرع طريقة للوصول إلى شخص هي واتساب, أو يوصلك نموذج الاتصال إلى قسم الجملة أو خدمة العملاء.',
    },
    links: [{ label: 'Contact us', to: '/contact' }],
  },
];

export const FAQ_TOPICS = [...new Set(FAQS.map((f) => f.topic))];
