'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'ar' | 'en' | 'fr' | 'de';

export const LANGUAGES: { code: Lang; nativeLabel: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'ar', nativeLabel: 'العربية', dir: 'rtl' },
  { code: 'en', nativeLabel: 'English', dir: 'ltr' },
  { code: 'fr', nativeLabel: 'Français', dir: 'ltr' },
  { code: 'de', nativeLabel: 'Deutsch', dir: 'ltr' },
];

export const t: Record<Lang, Record<string, string>> = {
  ar: {
    /* ── Navbar ── */
    home: 'الرئيسية', about: 'من نحن', products: 'استكشاف المنتجات',
    nav_all_products: 'جميع المنتجات', nav_bec_ink: 'حبر BEC',
    services: 'خدماتنا', contact: 'تواصل معنا',

    /* ── Hero ── */
    hero_badge: 'أجهزة أصلية • حبر BEC الخاص • حلول طباعة احترافية',
    hero_h1: 'أجهزة إلكترونية أصلية',
    hero_h2: 'وحبر BEC الخاص للطباعة الاحترافية',
    hero_desc: 'نوفر أفضل الأجهزة والطابعات بجانب حبر BEC الخاص بنا — حلول طباعة احترافية تثق بها في فلسطين.',
    hero_stat_products: 'منتج', hero_stat_brands: 'براند', hero_stat_years: 'سنوات خبرة',
    hero_cta_browse: 'تصفح المنتجات', hero_cta_ink: 'حبر BEC الأصلي',
    hero_brands_label: 'أبرز البراندات المتاحة',
    intro_loading: 'جاري التحميل',

    /* ── About ── */
    about_tag: 'من نحن',
    about_h2_1: 'بانياس للإلكترونيات', about_h2_2: 'BEC',
    about_desc: 'تأسست بانياس للإلكترونيات (BEC) عام 2017 في رام الله، ونقدم حلولاً تكنولوجية متكاملة للأفراد والشركات في فلسطين — بما فيها علامة حبر BEC الخاصة بنا.',
    about_address_title: 'عنوان الشركة',
    about_address: '📍 البيرة – شارع القدس – مقابل بكدار',
    about_feat1_title: 'حلول متكاملة', about_feat1_desc: 'نوفر أحدث الأجهزة والتقنيات مع خدمات الدعم والصيانة',
    about_feat2_title: 'جودة وموثوقية', about_feat2_desc: 'نقدم منتجات أصلية بجودة عالية وضمان موثوق',
    about_feat3_title: 'حبر BEC الأصلي', about_feat3_desc: 'علامتنا التجارية الخاصة من الحبر والتونر الأصلي',
    stat_clients_lbl: 'عميل راضي', stat_satisfaction_lbl: 'رضا العملاء', stat_founded_lbl: 'تأسست',
    stat_mission: 'نسعى لنكون الشريك التقني الأول في فلسطين، من خلال حلول مبتكرة وخدمات موثوقة',

    /* ── Products Carousel ── */
    sec_products_tag: 'منتجاتنا', sec_products_h2: 'استكشف المنتجات',
    viewall: 'عرض الكل', viewdetails: 'عرض التفاصيل',
    no_products: 'لا توجد منتجات حالياً', browse_catalog: 'تصفح الكتالوج',
    viewall_mobile: 'عرض جميع المنتجات',

    /* ── BEC Ink ── */
    ink_exclusive: 'المنتج الحصري من BEC',
    ink_h1: 'جودة طباعة', ink_h2a: 'تبدأ من حبر ', ink_h2b: 'BEC',
    ink_desc: 'أحبار BEC الخاصة — جودة احترافية بتكلفة مناسبة لجميع بيئات العمل.',
    ink_feat1: 'جودة طباعة عالية وألوان ثابتة',
    ink_feat2: 'متوافق مع أشهر الطابعات',
    ink_feat3: 'ألوان واضحة تدوم طويلاً',
    ink_stat1: 'موديل حبر', ink_stat2: 'علامة متوافقة', ink_stat3: 'جودة مضمونة',
    ink_cta1: 'تصفح كل منتجات الحبر', ink_cta2: 'للاستفسار',
    ink_card1_title: 'جودة طباعة عالية', ink_card1_desc: 'نتائج واضحة وألوان ثابتة في كل طباعة',
    ink_card2_title: 'أداء موثوق', ink_card2_desc: 'مصمم للاستخدام اليومي والمهني المكثف',
    ink_card3_title: 'توافق واسع', ink_card3_desc: 'يتوافق مع مجموعة كبيرة من الطابعات',
    ink_card4_title: 'قيمة أفضل', ink_card4_desc: 'حل اقتصادي بجودة تنافس الأصلية',
    ink_featured_h: 'منتجات الحبر المميزة', ink_featured_sub: 'اختيار من أكثر منتجاتنا طلباً',
    ink_viewall: 'عرض جميع منتجات الحبر', ink_coming_soon: 'سيتم إضافة منتجات الحبر المميزة قريباً',
    ink_browse_all: 'تصفح جميع المنتجات', ink_call_price: 'اتصل للسعر',
    ink_badge: 'حبر BEC', ink_orig_badge: 'حبر BEC الأصلي',

    /* ── Services ── */
    services_tag: 'خدماتنا', services_h2: 'حلول تقنية متكاملة',
    services_desc: 'نقدم مجموعة شاملة من الخدمات لتلبية جميع احتياجاتك التقنية',
    svc1_name: 'توريد الأجهزة', svc1_desc: 'توريد جميع أنواع الأجهزة الإلكترونية بأحدث المواصفات',
    svc2_name: 'الدعم الفني', svc2_desc: 'فريق دعم فني متخصص لحل جميع المشاكل التقنية',
    svc3_name: 'الصيانة', svc3_desc: 'صيانة دورية وطارئة لجميع الأجهزة',
    svc4_name: 'حلول الشبكات', svc4_desc: 'تصميم وتنفيذ حلول شبكات متكاملة',
    svc5_name: 'حلول الأعمال', svc5_desc: 'حلول تقنية متكاملة للشركات والمؤسسات',

    /* ── Contact ── */
    contact_tag: 'تواصل معنا', contact_h2: 'نحن هنا لخدمتك',
    contact_desc: 'فريقنا جاهز للإجابة على استفساراتك وتقديم المساعدة',
    wa_title: 'واتساب', wa_desc: 'دردش معنا مباشرة', wa_btn: 'ابدأ المحادثة',
    email_title: 'جيميل', email_desc: 'راسلنا عبر Gmail', email_btn: 'أرسل عبر جيميل',
    fb_title: 'فيسبوك', fb_desc: 'تابعنا للحصول على أحدث العروض', fb_btn: 'تابعنا على فيسبوك',

    /* ── Footer ── */
    footer_desc: 'نسعى دائماً لتقديم أحدث التقنيات وأفضل الحلول بما فيها حبر BEC الأصلي.',
    footer_quicklinks: 'روابط سريعة', footer_our_services: 'خدماتنا', footer_follow: 'تابعنا',
    footer_ink: 'حبر BEC', footer_copyright: 'جميع الحقوق محفوظة.',

    /* ── Products Page ── */
    page_products_h1: 'جميع المنتجات',
    page_products_sub: 'اكتشف مجموعتنا المتنوعة من أحدث المنتجات والتقنيات',
    filter_all: 'الكل', filter_categories: 'الفئات', filter_brands_label: 'الماركة',
    filter_clear_all: 'مسح جميع الفلاتر', filter_clear: 'مسح',
    search_placeholder: 'ابحث عن منتج أو ماركة...', filter_btn: 'فلترة',
    sort_default: 'الترتيب الافتراضي', sort_name_asc: 'الاسم: أ — ي', sort_name_desc: 'الاسم: ي — أ',
    sort_newest: 'الأحدث', sort_price_asc: 'السعر: الأقل أولاً', sort_price_desc: 'السعر: الأعلى أولاً',
    store_title: 'جميع المنتجات', filter_price: 'نطاق السعر', price_from: 'من', price_to: 'إلى',
    load_more: 'عرض المزيد', remaining: 'متبقي',
    result_model: 'موديل', result_brands: 'ماركة',
    no_results: 'لا توجد منتجات تطابق الفلتر', no_results_clear: 'مسح الفلاتر',
    model_singular: 'موديل', model_plural: 'موديلات',
    products_page_title: 'منتجات BEC', products_page_subtitle: 'اختر نوع المنتج الذي تبحث عنه',
    type_label_printer: 'طابعات', type_label_ink: 'أحبار', type_label_device: 'أجهزة',
    type_label_gaming: 'ملحقات الجيمينج', type_label_gaming_laptop: 'لابتوب جيمينج', type_label_other: 'أخرى',
    type_label_smartwatch: 'ساعات ذكية', type_label_headphones: 'سماعات وإيرفون',
    type_desc_printer: 'طابعات BEC عالية الجودة', type_desc_ink: 'أحبار BEC الأصلية',
    type_desc_device: 'أجهزة إلكترونية متنوعة', type_desc_gaming: 'سماعات وكيبورد وماوس من Green Lion',
    type_desc_gaming_laptop: 'لابتوبات جيمينج عالية الأداء', type_desc_other: 'منتجات متنوعة',
    type_items_available: 'صنف متاح', no_products_yet: 'لا توجد منتجات بعد',
    back: 'رجوع', type_count_unit: 'صنف', search_in: 'ابحث في',
    filter_colored: 'ملون', filter_uncolored: 'غير ملون', clear_filters: 'مسح الفلاتر',
    details: 'التفاصيل',
    nav_unit_ink: 'لون', nav_unit_printer: 'طابعة', nav_unit_gaming: 'ملحق', nav_unit_gaming_laptop: 'لابتوب',
    nav_unit_device: 'جهاز', nav_unit_other: 'منتج',

    /* ── Product Detail ── */
    loading: 'جاري تحميل المنتج...', notFound: 'المنتج غير موجود',
    browseProducts: 'تصفح المنتجات',
    brand: 'الماركة', printer: 'الطابعة', color: 'اللون', model: 'الموديل', price: 'السعر',
    specs: 'المواصفات التقنية', aboutProduct: 'عن المنتج',
    contactQuestion: 'هل لديك استفسار أو تريد الشراء؟',
    contactUs: 'تواصل معنا ونرد عليك فوراً',
    whatsapp: 'تواصل عبر واتساب', otherContact: 'طرق تواصل أخرى',
    relatedProducts: 'منتجات قد تعجبك', viewAll: 'عرض الكل',
    originalInk: 'حبر BEC الأصلي',
    compatible_with: 'متوافق مع',
    /* ── Color values ── */
    color_val_black: 'أسود', color_val_cyan: 'سيان', color_val_magenta: 'فوشيا',
    color_val_yellow: 'أصفر', color_val_mixed: 'أسود وملون',
    /* ── Misc UI ── */
    no_featured_yet: 'لا توجد منتجات مميزة للعرض بعد',
    translating: 'جاري الترجمة...',
  },

  en: {
    home: 'Home', about: 'About Us', products: 'Explore Products',
    nav_all_products: 'All Products', nav_bec_ink: 'BEC Ink',
    services: 'Services', contact: 'Contact Us',

    hero_badge: 'Original Devices • BEC Ink • Professional Printing Solutions',
    hero_h1: 'Original Electronic Devices',
    hero_h2: 'and BEC Ink for Professional Printing',
    hero_desc: 'We provide the best devices and printers alongside our own BEC Ink — professional printing solutions you can trust in Palestine.',
    hero_stat_products: 'Products', hero_stat_brands: 'Brands', hero_stat_years: 'Years Experience',
    hero_cta_browse: 'Browse Products', hero_cta_ink: 'BEC Original Ink',
    hero_brands_label: 'Top Available Brands',
    intro_loading: 'Loading',

    about_tag: 'About Us',
    about_h2_1: 'Banyas Electronics', about_h2_2: 'BEC',
    about_desc: 'Banyas Electronics Co. (BEC) was founded in 2017 in Ramallah. We provide comprehensive technology solutions for individuals and businesses in Palestine — including our own BEC Ink brand.',
    about_address_title: 'Our Address',
    about_address: '📍 Al-Bireh – Jerusalem Street – Opposite Bakdar',
    about_feat1_title: 'Complete Solutions', about_feat1_desc: 'We provide the latest devices and technologies with support and maintenance services',
    about_feat2_title: 'Quality & Reliability', about_feat2_desc: 'We offer original products with high quality and trusted warranty',
    about_feat3_title: 'BEC Original Ink', about_feat3_desc: 'Our own brand of original ink and toner',
    stat_clients_lbl: 'Satisfied Clients', stat_satisfaction_lbl: 'Client Satisfaction', stat_founded_lbl: 'Founded',
    stat_mission: 'We strive to be the leading technology partner in Palestine through innovative solutions and reliable services',

    sec_products_tag: 'Our Products', sec_products_h2: 'Explore Products',
    viewall: 'View All', viewdetails: 'View Details',
    no_products: 'No products available', browse_catalog: 'Browse Catalog',
    viewall_mobile: 'View All Products',

    ink_exclusive: 'BEC Exclusive Product',
    ink_h1: 'Print Quality', ink_h2a: 'Starts with ', ink_h2b: 'BEC Ink',
    ink_desc: "BEC's own inks — professional quality at affordable cost for all work environments.",
    ink_feat1: 'High print quality with stable colors',
    ink_feat2: 'Compatible with major printers',
    ink_feat3: 'Clear colors that last long',
    ink_stat1: 'Ink Models', ink_stat2: 'Compatible Brands', ink_stat3: 'Guaranteed Quality',
    ink_cta1: 'Browse All Ink Products', ink_cta2: 'Inquire',
    ink_card1_title: 'High Print Quality', ink_card1_desc: 'Clear results and stable colors in every print',
    ink_card2_title: 'Reliable Performance', ink_card2_desc: 'Designed for daily and intensive professional use',
    ink_card3_title: 'Wide Compatibility', ink_card3_desc: 'Compatible with a wide range of printers',
    ink_card4_title: 'Better Value', ink_card4_desc: 'An economical solution with quality rivaling the original',
    ink_featured_h: 'Featured Ink Products', ink_featured_sub: 'Selected from our most requested products',
    ink_viewall: 'View All Ink Products', ink_coming_soon: 'Featured ink products will be added soon',
    ink_browse_all: 'Browse All Products', ink_call_price: 'Call for Price',
    ink_badge: 'BEC Ink', ink_orig_badge: 'Original BEC Ink',

    services_tag: 'Our Services', services_h2: 'Complete Technology Solutions',
    services_desc: 'We provide a comprehensive range of services to meet all your technology needs',
    svc1_name: 'Device Supply', svc1_desc: 'Supply of all types of electronic devices with the latest specifications',
    svc2_name: 'Technical Support', svc2_desc: 'Specialized technical support team to solve all technical problems',
    svc3_name: 'Maintenance', svc3_desc: 'Periodic and emergency maintenance for all devices',
    svc4_name: 'Network Solutions', svc4_desc: 'Design and implementation of integrated network solutions',
    svc5_name: 'Business Solutions', svc5_desc: 'Integrated technology solutions for companies and institutions',

    contact_tag: 'Contact Us', contact_h2: 'We\'re Here to Serve You',
    contact_desc: 'Our team is ready to answer your inquiries and provide assistance',
    wa_title: 'WhatsApp', wa_desc: 'Chat with us directly', wa_btn: 'Start Chat',
    email_title: 'Gmail', email_desc: 'Email us via Gmail', email_btn: 'Send via Gmail',
    fb_title: 'Facebook', fb_desc: 'Follow us for the latest offers', fb_btn: 'Follow on Facebook',

    footer_desc: 'We always strive to offer the latest technologies and best solutions including original BEC Ink.',
    footer_quicklinks: 'Quick Links', footer_our_services: 'Our Services', footer_follow: 'Follow Us',
    footer_ink: 'BEC Ink', footer_copyright: 'All rights reserved.',

    page_products_h1: 'All Products',
    page_products_sub: 'Discover our diverse collection of the latest products and technologies',
    filter_all: 'All', filter_categories: 'Categories', filter_brands_label: 'Brand',
    filter_clear_all: 'Clear All Filters', filter_clear: 'Clear',
    search_placeholder: 'Search for a product or brand...', filter_btn: 'Filter',
    sort_default: 'Default Sort', sort_name_asc: 'Name: A — Z', sort_name_desc: 'Name: Z — A',
    sort_newest: 'Newest', sort_price_asc: 'Price: Low to High', sort_price_desc: 'Price: High to Low',
    store_title: 'All Products', filter_price: 'Price Range', price_from: 'From', price_to: 'To',
    load_more: 'Load More', remaining: 'remaining',
    result_model: 'model', result_brands: 'brand',
    no_results: 'No products match the filter', no_results_clear: 'Clear Filters',
    model_singular: 'model', model_plural: 'models',
    products_page_title: 'BEC Products', products_page_subtitle: 'Choose the type of product you\'re looking for',
    type_label_printer: 'Printers', type_label_ink: 'Inks', type_label_device: 'Devices',
    type_label_gaming: 'Gaming Accessories', type_label_gaming_laptop: 'Gaming Laptops', type_label_other: 'Other',
    type_label_smartwatch: 'Smart Watches', type_label_headphones: 'Headphones & Earbuds',
    type_desc_printer: 'High-quality BEC printers', type_desc_ink: 'Original BEC inks',
    type_desc_device: 'Various electronic devices', type_desc_gaming: 'Headsets, keyboards & mice from Green Lion',
    type_desc_gaming_laptop: 'High-performance gaming laptops', type_desc_other: 'Miscellaneous products',
    type_items_available: 'items available', no_products_yet: 'No products yet',
    back: 'Back', type_count_unit: 'items', search_in: 'Search in',
    filter_colored: 'Colored', filter_uncolored: 'Uncolored', clear_filters: 'Clear Filters',
    details: 'Details',
    nav_unit_ink: 'color', nav_unit_printer: 'printer', nav_unit_gaming: 'accessory', nav_unit_gaming_laptop: 'laptop',
    nav_unit_device: 'device', nav_unit_other: 'product',

    loading: 'Loading product...', notFound: 'Product not found',
    browseProducts: 'Browse Products',
    brand: 'Brand', printer: 'Printer', color: 'Color', model: 'Model', price: 'Price',
    specs: 'Technical Specifications', aboutProduct: 'About This Product',
    contactQuestion: 'Have a question or want to buy?',
    contactUs: 'Contact us and we\'ll reply instantly',
    whatsapp: 'Chat on WhatsApp', otherContact: 'Other Contact Methods',
    relatedProducts: 'You May Also Like', viewAll: 'View All',
    originalInk: 'Original BEC Ink',
    compatible_with: 'Compatible with',
    color_val_black: 'Black', color_val_cyan: 'Cyan', color_val_magenta: 'Magenta',
    color_val_yellow: 'Yellow', color_val_mixed: 'Black & Color',
    no_featured_yet: 'No featured products to display yet',
    translating: 'Translating...',
  },

  fr: {
    home: 'Accueil', about: 'À propos', products: 'Explorer les produits',
    nav_all_products: 'Tous les produits', nav_bec_ink: 'Encre BEC',
    services: 'Services', contact: 'Contactez-nous',

    hero_badge: 'Appareils originaux • Encre BEC • Solutions d\'impression professionnelles',
    hero_h1: 'Appareils électroniques originaux',
    hero_h2: 'et l\'encre BEC pour l\'impression professionnelle',
    hero_desc: 'Nous fournissons les meilleurs appareils et imprimantes avec notre propre encre BEC — des solutions d\'impression professionnelles en Palestine.',
    hero_stat_products: 'Produits', hero_stat_brands: 'Marques', hero_stat_years: 'Ans d\'expérience',
    hero_cta_browse: 'Parcourir les produits', hero_cta_ink: 'Encre BEC originale',
    hero_brands_label: 'Meilleures marques disponibles',
    intro_loading: 'Chargement',

    about_tag: 'À propos',
    about_h2_1: 'Banyas Electronics', about_h2_2: 'BEC',
    about_desc: 'Banyas Electronics Co. (BEC) a été fondée en 2017 à Ramallah. Nous fournissons des solutions technologiques complètes aux particuliers et aux entreprises en Palestine — y compris notre propre marque d\'encre BEC.',
    about_address_title: 'Notre adresse',
    about_address: '📍 Al-Bireh – Rue de Jérusalem – En face de Bakdar',
    about_feat1_title: 'Solutions complètes', about_feat1_desc: 'Nous fournissons les derniers appareils et technologies avec des services de support et de maintenance',
    about_feat2_title: 'Qualité et fiabilité', about_feat2_desc: 'Nous proposons des produits originaux de haute qualité avec une garantie fiable',
    about_feat3_title: 'Encre BEC originale', about_feat3_desc: 'Notre propre marque d\'encre et de toner originaux',
    stat_clients_lbl: 'Clients satisfaits', stat_satisfaction_lbl: 'Satisfaction client', stat_founded_lbl: 'Fondée',
    stat_mission: 'Nous aspirons à être le premier partenaire technologique en Palestine grâce à des solutions innovantes et des services fiables',

    sec_products_tag: 'Nos produits', sec_products_h2: 'Explorer les produits',
    viewall: 'Voir tout', viewdetails: 'Voir les détails',
    no_products: 'Aucun produit disponible', browse_catalog: 'Parcourir le catalogue',
    viewall_mobile: 'Voir tous les produits',

    ink_exclusive: 'Produit exclusif BEC',
    ink_h1: 'Qualité d\'impression', ink_h2a: 'commence avec ', ink_h2b: 'l\'encre BEC',
    ink_desc: 'Les encres propres de BEC — qualité professionnelle à coût abordable pour tous les environnements de travail.',
    ink_feat1: 'Haute qualité d\'impression avec des couleurs stables',
    ink_feat2: 'Compatible avec les principales imprimantes',
    ink_feat3: 'Des couleurs claires qui durent longtemps',
    ink_stat1: 'Modèles d\'encre', ink_stat2: 'Marques compatibles', ink_stat3: 'Qualité garantie',
    ink_cta1: 'Parcourir tous les produits d\'encre', ink_cta2: 'Nous contacter',
    ink_card1_title: 'Haute qualité d\'impression', ink_card1_desc: 'Résultats clairs et couleurs stables à chaque impression',
    ink_card2_title: 'Performance fiable', ink_card2_desc: 'Conçu pour un usage quotidien et professionnel intensif',
    ink_card3_title: 'Large compatibilité', ink_card3_desc: 'Compatible avec un large éventail d\'imprimantes',
    ink_card4_title: 'Meilleure valeur', ink_card4_desc: 'Une solution économique avec une qualité rivalisant avec l\'original',
    ink_featured_h: 'Produits d\'encre en vedette', ink_featured_sub: 'Sélection de nos produits les plus demandés',
    ink_viewall: 'Voir tous les produits d\'encre', ink_coming_soon: 'Les produits d\'encre en vedette seront ajoutés prochainement',
    ink_browse_all: 'Parcourir tous les produits', ink_call_price: 'Appeler pour le prix',
    ink_badge: 'Encre BEC', ink_orig_badge: 'Encre BEC originale',

    services_tag: 'Nos services', services_h2: 'Solutions technologiques complètes',
    services_desc: 'Nous proposons une gamme complète de services pour répondre à tous vos besoins technologiques',
    svc1_name: 'Fourniture d\'appareils', svc1_desc: 'Fourniture de tous types d\'appareils électroniques avec les dernières spécifications',
    svc2_name: 'Support technique', svc2_desc: 'Équipe de support technique spécialisée pour résoudre tous les problèmes techniques',
    svc3_name: 'Maintenance', svc3_desc: 'Maintenance périodique et d\'urgence pour tous les appareils',
    svc4_name: 'Solutions réseau', svc4_desc: 'Conception et mise en œuvre de solutions réseau intégrées',
    svc5_name: 'Solutions d\'entreprise', svc5_desc: 'Solutions technologiques intégrées pour les entreprises et les institutions',

    contact_tag: 'Contactez-nous', contact_h2: 'Nous sommes là pour vous servir',
    contact_desc: 'Notre équipe est prête à répondre à vos demandes et à vous aider',
    wa_title: 'WhatsApp', wa_desc: 'Chattez avec nous directement', wa_btn: 'Commencer la conversation',
    email_title: 'Gmail', email_desc: 'Envoyez-nous un e-mail via Gmail', email_btn: 'Envoyer via Gmail',
    fb_title: 'Facebook', fb_desc: 'Suivez-nous pour les dernières offres', fb_btn: 'Suivre sur Facebook',

    footer_desc: 'Nous nous efforçons toujours d\'offrir les dernières technologies et les meilleures solutions, y compris l\'encre BEC originale.',
    footer_quicklinks: 'Liens rapides', footer_our_services: 'Nos services', footer_follow: 'Suivez-nous',
    footer_ink: 'Encre BEC', footer_copyright: 'Tous droits réservés.',

    page_products_h1: 'Tous les produits',
    page_products_sub: 'Découvrez notre collection variée des derniers produits et technologies',
    filter_all: 'Tout', filter_categories: 'Catégories', filter_brands_label: 'Marque',
    filter_clear_all: 'Effacer tous les filtres', filter_clear: 'Effacer',
    search_placeholder: 'Rechercher un produit ou une marque...', filter_btn: 'Filtrer',
    sort_default: 'Tri par défaut', sort_name_asc: 'Nom: A — Z', sort_name_desc: 'Nom: Z — A',
    sort_newest: 'Plus récent', sort_price_asc: 'Prix: croissant', sort_price_desc: 'Prix: décroissant',
    store_title: 'Tous les produits', filter_price: 'Fourchette de prix', price_from: 'De', price_to: 'À',
    load_more: 'Voir plus', remaining: 'restant',
    result_model: 'modèle', result_brands: 'marque',
    no_results: 'Aucun produit ne correspond au filtre', no_results_clear: 'Effacer les filtres',
    model_singular: 'modèle', model_plural: 'modèles',
    products_page_title: 'Produits BEC', products_page_subtitle: 'Choisissez le type de produit que vous recherchez',
    type_label_printer: 'Imprimantes', type_label_ink: 'Encres', type_label_device: 'Appareils',
    type_label_gaming: 'Accessoires gaming', type_label_gaming_laptop: 'PC portables gaming', type_label_other: 'Autres',
    type_label_smartwatch: 'Montres intelligentes', type_label_headphones: 'Casques et écouteurs',
    type_desc_printer: 'Imprimantes BEC haute qualité', type_desc_ink: 'Encres BEC originales',
    type_desc_device: 'Appareils électroniques variés', type_desc_gaming: 'Casques, claviers et souris Green Lion',
    type_desc_gaming_laptop: 'PC portables gaming haute performance', type_desc_other: 'Produits divers',
    type_items_available: 'articles disponibles', no_products_yet: 'Aucun produit encore',
    back: 'Retour', type_count_unit: 'articles', search_in: 'Rechercher dans',
    filter_colored: 'Coloré', filter_uncolored: 'Non coloré', clear_filters: 'Effacer les filtres',
    details: 'Détails',
    nav_unit_ink: 'couleur', nav_unit_printer: 'imprimante', nav_unit_gaming: 'accessoire', nav_unit_gaming_laptop: 'portable',
    nav_unit_device: 'appareil', nav_unit_other: 'produit',

    loading: 'Chargement du produit...', notFound: 'Produit introuvable',
    browseProducts: 'Parcourir les produits',
    brand: 'Marque', printer: 'Imprimante', color: 'Couleur', model: 'Modèle', price: 'Prix',
    specs: 'Spécifications techniques', aboutProduct: 'À propos du produit',
    contactQuestion: 'Vous avez une question ou voulez acheter ?',
    contactUs: 'Contactez-nous, nous répondons immédiatement',
    whatsapp: 'Contacter via WhatsApp', otherContact: 'Autres méthodes de contact',
    relatedProducts: 'Vous aimerez peut-être', viewAll: 'Voir tout',
    originalInk: 'Encre BEC originale',
    compatible_with: 'Compatible avec',
    color_val_black: 'Noir', color_val_cyan: 'Cyan', color_val_magenta: 'Magenta',
    color_val_yellow: 'Jaune', color_val_mixed: 'Noir et couleur',
    no_featured_yet: 'Aucun produit vedette à afficher pour l\'instant',
    translating: 'Traduction...',
  },

  de: {
    home: 'Startseite', about: 'Über uns', products: 'Produkte entdecken',
    nav_all_products: 'Alle Produkte', nav_bec_ink: 'BEC-Tinte',
    services: 'Dienstleistungen', contact: 'Kontakt',

    hero_badge: 'Originalgeräte • BEC-Tinte • Professionelle Drucklösungen',
    hero_h1: 'Originale Elektronikgeräte',
    hero_h2: 'und BEC-Tinte für professionellen Druck',
    hero_desc: 'Wir liefern die besten Geräte und Drucker zusammen mit unserer eigenen BEC-Tinte — professionelle Drucklösungen für Palästina.',
    hero_stat_products: 'Produkte', hero_stat_brands: 'Marken', hero_stat_years: 'Jahre Erfahrung',
    hero_cta_browse: 'Produkte durchsuchen', hero_cta_ink: 'Originale BEC-Tinte',
    hero_brands_label: 'Top verfügbare Marken',
    intro_loading: 'Wird geladen',

    about_tag: 'Über uns',
    about_h2_1: 'Banyas Electronics', about_h2_2: 'BEC',
    about_desc: 'Banyas Electronics Co. (BEC) wurde 2017 in Ramallah gegründet. Wir bieten umfassende Technologielösungen für Einzelpersonen und Unternehmen in Palästina — einschließlich unserer eigenen BEC-Tintenmarke.',
    about_address_title: 'Unsere Adresse',
    about_address: '📍 Al-Bireh – Jerusalemer Straße – Gegenüber von Bakdar',
    about_feat1_title: 'Komplette Lösungen', about_feat1_desc: 'Wir bieten die neuesten Geräte und Technologien mit Support- und Wartungsservices',
    about_feat2_title: 'Qualität & Zuverlässigkeit', about_feat2_desc: 'Wir bieten Originalprodukte mit hoher Qualität und zuverlässiger Garantie',
    about_feat3_title: 'Originale BEC-Tinte', about_feat3_desc: 'Unsere eigene Marke für originale Tinte und Toner',
    stat_clients_lbl: 'Zufriedene Kunden', stat_satisfaction_lbl: 'Kundenzufriedenheit', stat_founded_lbl: 'Gegründet',
    stat_mission: 'Wir streben danach, der führende Technologiepartner in Palästina zu sein — durch innovative Lösungen und zuverlässige Services',

    sec_products_tag: 'Unsere Produkte', sec_products_h2: 'Produkte entdecken',
    viewall: 'Alle anzeigen', viewdetails: 'Details anzeigen',
    no_products: 'Keine Produkte verfügbar', browse_catalog: 'Katalog durchsuchen',
    viewall_mobile: 'Alle Produkte anzeigen',

    ink_exclusive: 'BEC-Exklusivprodukt',
    ink_h1: 'Druckqualität', ink_h2a: 'beginnt mit ', ink_h2b: 'BEC-Tinte',
    ink_desc: 'BECs eigene Tinten — professionelle Qualität zu erschwinglichen Kosten für alle Arbeitsumgebungen.',
    ink_feat1: 'Hohe Druckqualität mit stabilen Farben',
    ink_feat2: 'Kompatibel mit den wichtigsten Druckern',
    ink_feat3: 'Klare Farben, die lange halten',
    ink_stat1: 'Tintenmodelle', ink_stat2: 'Kompatible Marken', ink_stat3: 'Garantierte Qualität',
    ink_cta1: 'Alle Tintenprodukte durchsuchen', ink_cta2: 'Anfragen',
    ink_card1_title: 'Hohe Druckqualität', ink_card1_desc: 'Klare Ergebnisse und stabile Farben bei jedem Druck',
    ink_card2_title: 'Zuverlässige Leistung', ink_card2_desc: 'Entwickelt für den täglichen und intensiven professionellen Einsatz',
    ink_card3_title: 'Breite Kompatibilität', ink_card3_desc: 'Kompatibel mit einer Vielzahl von Druckern',
    ink_card4_title: 'Besserer Wert', ink_card4_desc: 'Eine wirtschaftliche Lösung mit Qualität, die das Original rivalisiert',
    ink_featured_h: 'Empfohlene Tintenprodukte', ink_featured_sub: 'Auswahl unserer meistgefragten Produkte',
    ink_viewall: 'Alle Tintenprodukte anzeigen', ink_coming_soon: 'Empfohlene Tintenprodukte werden bald hinzugefügt',
    ink_browse_all: 'Alle Produkte durchsuchen', ink_call_price: 'Preis erfragen',
    ink_badge: 'BEC-Tinte', ink_orig_badge: 'Originale BEC-Tinte',

    services_tag: 'Unsere Dienste', services_h2: 'Komplette Technologielösungen',
    services_desc: 'Wir bieten eine umfassende Palette von Dienstleistungen für alle Ihre Technologiebedürfnisse',
    svc1_name: 'Gerätelieferung', svc1_desc: 'Lieferung aller Arten von Elektronikgeräten mit den neuesten Spezifikationen',
    svc2_name: 'Technischer Support', svc2_desc: 'Spezialisiertes technisches Support-Team zur Lösung aller technischen Probleme',
    svc3_name: 'Wartung', svc3_desc: 'Regelmäßige und Notfallwartung für alle Geräte',
    svc4_name: 'Netzwerklösungen', svc4_desc: 'Entwurf und Implementierung integrierter Netzwerklösungen',
    svc5_name: 'Geschäftslösungen', svc5_desc: 'Integrierte Technologielösungen für Unternehmen und Institutionen',

    contact_tag: 'Kontakt', contact_h2: 'Wir sind für Sie da',
    contact_desc: 'Unser Team ist bereit, Ihre Anfragen zu beantworten und Hilfe zu leisten',
    wa_title: 'WhatsApp', wa_desc: 'Chatten Sie direkt mit uns', wa_btn: 'Chat starten',
    email_title: 'Gmail', email_desc: 'Schreiben Sie uns per Gmail', email_btn: 'Via Gmail senden',
    fb_title: 'Facebook', fb_desc: 'Folgen Sie uns für die neuesten Angebote', fb_btn: 'Auf Facebook folgen',

    footer_desc: 'Wir streben immer danach, die neuesten Technologien und besten Lösungen anzubieten, einschließlich originaler BEC-Tinte.',
    footer_quicklinks: 'Schnelllinks', footer_our_services: 'Unsere Dienste', footer_follow: 'Folgen Sie uns',
    footer_ink: 'BEC-Tinte', footer_copyright: 'Alle Rechte vorbehalten.',

    page_products_h1: 'Alle Produkte',
    page_products_sub: 'Entdecken Sie unsere vielfältige Kollektion der neuesten Produkte und Technologien',
    filter_all: 'Alle', filter_categories: 'Kategorien', filter_brands_label: 'Marke',
    filter_clear_all: 'Alle Filter löschen', filter_clear: 'Löschen',
    search_placeholder: 'Produkt oder Marke suchen...', filter_btn: 'Filtern',
    sort_default: 'Standardsortierung', sort_name_asc: 'Name: A — Z', sort_name_desc: 'Name: Z — A',
    sort_newest: 'Neueste', sort_price_asc: 'Preis: aufsteigend', sort_price_desc: 'Preis: absteigend',
    store_title: 'Alle Produkte', filter_price: 'Preisspanne', price_from: 'Von', price_to: 'Bis',
    load_more: 'Mehr laden', remaining: 'verbleibend',
    result_model: 'Modell', result_brands: 'Marke',
    no_results: 'Keine Produkte entsprechen dem Filter', no_results_clear: 'Filter löschen',
    model_singular: 'Modell', model_plural: 'Modelle',
    products_page_title: 'BEC-Produkte', products_page_subtitle: 'Wählen Sie den Produkttyp aus, den Sie suchen',
    type_label_printer: 'Drucker', type_label_ink: 'Tinten', type_label_device: 'Geräte',
    type_label_gaming: 'Gaming-Zubehör', type_label_gaming_laptop: 'Gaming-Laptops', type_label_other: 'Andere',
    type_label_smartwatch: 'Smartwatches', type_label_headphones: 'Kopfhörer & Ohrhörer',
    type_desc_printer: 'Hochwertige BEC-Drucker', type_desc_ink: 'Originale BEC-Tinten',
    type_desc_device: 'Verschiedene Elektronikgeräte', type_desc_gaming: 'Headsets, Tastaturen & Mäuse von Green Lion',
    type_desc_gaming_laptop: 'Hochleistungs-Gaming-Laptops', type_desc_other: 'Verschiedene Produkte',
    type_items_available: 'Artikel verfügbar', no_products_yet: 'Noch keine Produkte',
    back: 'Zurück', type_count_unit: 'Artikel', search_in: 'Suchen in',
    filter_colored: 'Farbig', filter_uncolored: 'Nicht farbig', clear_filters: 'Filter löschen',
    details: 'Details',
    nav_unit_ink: 'Farbe', nav_unit_printer: 'Drucker', nav_unit_gaming: 'Zubehör', nav_unit_gaming_laptop: 'Laptop',
    nav_unit_device: 'Gerät', nav_unit_other: 'Produkt',

    loading: 'Produkt wird geladen...', notFound: 'Produkt nicht gefunden',
    browseProducts: 'Produkte durchsuchen',
    brand: 'Marke', printer: 'Drucker', color: 'Farbe', model: 'Modell', price: 'Preis',
    specs: 'Technische Spezifikationen', aboutProduct: 'Über dieses Produkt',
    contactQuestion: 'Haben Sie eine Frage oder möchten kaufen?',
    contactUs: 'Kontaktieren Sie uns – wir antworten sofort',
    whatsapp: 'Über WhatsApp kontaktieren', otherContact: 'Andere Kontaktmethoden',
    relatedProducts: 'Das könnte Ihnen gefallen', viewAll: 'Alle anzeigen',
    originalInk: 'Originale BEC-Tinte',
    compatible_with: 'Kompatibel mit',
    color_val_black: 'Schwarz', color_val_cyan: 'Cyan', color_val_magenta: 'Magenta',
    color_val_yellow: 'Gelb', color_val_mixed: 'Schwarz & Farbe',
    no_featured_yet: 'Noch keine empfohlenen Produkte anzuzeigen',
    translating: 'Übersetzen...',
  },
};

interface LanguageContextType {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (l: Lang) => void;
  tr: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar', dir: 'rtl', setLang: () => {}, tr: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('bec-lang') as Lang | null;
    if (saved && ['ar', 'en', 'fr', 'de'].includes(saved)) {
      setLangState(saved);
      const info = LANGUAGES.find(x => x.code === saved)!;
      document.documentElement.lang = saved;
      document.documentElement.dir = info.dir;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('bec-lang', l);
    const info = LANGUAGES.find(x => x.code === l)!;
    document.documentElement.lang = l;
    document.documentElement.dir = info.dir;
  };

  const info = LANGUAGES.find(x => x.code === lang)!;
  const tr = (key: string) => t[lang][key] ?? t['ar'][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, dir: info.dir, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
