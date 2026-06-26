// prisma/seed-gaming.mjs
// Run with: node prisma/seed-gaming.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BRAND = 'Green Lion';
const CATEGORY = 'ملحقات الجيمينج';
const TYPE = 'Gaming';

const gamingProducts = [
  /* ══════════════════════════════
     1. سماعة Shadow ANC Gaming
  ══════════════════════════════ */
  {
    name: 'سماعة Green Lion Shadow ANC للجيمينج',
    category: CATEGORY,
    description: 'سماعة جيمينج لاسلكية من Green Lion بتقنية إلغاء الضوضاء النشط ANC وبطارية تدوم 50 ساعة.',
    image: 'https://www.greenlion.net/web/image/product.template/110131/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNSHDANCHPBK',
    colorType: 'Black',
    featured: true,
    variants: [
      {
        name: 'Green Lion Shadow ANC Gaming Headset - أسود',
        brand: BRAND,
        price: 87,
        specifications: [
          'الموديل: GNSHDANCHPBK',
          'العلامة التجارية: Green Lion',
          'النوع: سماعة جيمينج لاسلكية',
          'الاتصال: بلوتوث 6.0 / 2.4G لاسلكي / سلكي',
          'السماعة: 50mm high-fidelity',
          'إلغاء الضوضاء: ANC نشط بعمق 18dB ±3dB',
          'عمر البطارية: 50 ساعة (بدون RGB/ANC) / 40 ساعة (مع RGB/ANC)',
          'سعة البطارية: 600mAh',
          'وقت الشحن: 2.5 ساعة عبر Type-C',
          'الميكروفون: قابل للفصل (Detachable Boom Mic)',
          'نطاق التشغيل: 10 متر',
          'زمن الاستجابة: 20ms (2.4G)',
          'الوزن: 287g',
          'اللون: أسود',
          'السعر: 87 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/110131/image_1920',
        colorType: 'Black',
        featured: true,
      },
    ],
  },

  /* ══════════════════════════════
     2. سماعة GP32X Gaming
  ══════════════════════════════ */
  {
    name: 'سماعة Green Lion GP32X للجيمينج',
    category: CATEGORY,
    description: 'سماعة جيمينج سلكية من Green Lion بسماعات 50mm وإضاءة RGB ثلاثية الألوان وميكروفون لإلغاء الضوضاء.',
    image: 'https://www.greenlion.net/web/image/product.template/4112/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNGP32XGHBK',
    colorType: 'Black',
    featured: true,
    variants: [
      {
        name: 'Green Lion GP32X Gaming Headphone - أسود',
        brand: BRAND,
        price: 70,
        specifications: [
          'الموديل: GNGP32XGHBK',
          'العلامة التجارية: Green Lion',
          'النوع: سماعة جيمينج سلكية',
          'السماعة: 50mm',
          'استجابة التردد: 20Hz - 20kHz',
          'الاتصال: جاك 3.5mm',
          'طول الكابل: 2.1 متر',
          'الميكروفون: ميكروفون شامل الاتجاهات - إلغاء ضوضاء',
          'حساسية الميكروفون: -40dB ±2dB',
          'مقاومة السماعات: 32Ω ±15%',
          'أقصى طاقة دخل: 20mW',
          'الإضاءة: 3 ألوان RGB',
          'التصميم: 360° بنية مرنة للميكروفون',
          'التوافق: PC / PS4 / Xbox / موبايل / Nintendo Switch',
          'اللون: أسود',
          'السعر: 70 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/4112/image_1920',
        colorType: 'Black',
        featured: true,
      },
    ],
  },

  /* ══════════════════════════════
     3. سماعة GP27X Gaming
  ══════════════════════════════ */
  {
    name: 'سماعة Green Lion GP27X للجيمينج',
    category: CATEGORY,
    description: 'سماعة جيمينج سلكية من Green Lion بسماعات 50mm وإضاءة 3 ألوان ومخرج صوت عالي الدقة.',
    image: 'https://www.greenlion.net/web/image/product.template/4113/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNGP27XGHBK',
    colorType: 'Black',
    featured: false,
    variants: [
      {
        name: 'Green Lion GP27X Gaming Headphone - أسود',
        brand: BRAND,
        price: 70,
        specifications: [
          'الموديل: GNGP27XGHBK',
          'العلامة التجارية: Green Lion',
          'النوع: سماعة جيمينج سلكية',
          'السماعة: 50mm',
          'استجابة التردد: 20Hz - 20kHz',
          'الاتصال: جاك 3.5mm',
          'طول الكابل: 2.1 متر',
          'الميكروفون: ميكروفون شامل الاتجاهات',
          'حساسية الميكروفون: -40dB ±2dB',
          'مقاومة السماعات: 32Ω ±15%',
          'أقصى طاقة دخل: 20mW',
          'الإضاءة: 3 ألوان',
          'التصميم: ذراع ميكروفون 360° قابل للتعديل',
          'التوافق: PC / PS4 / Xbox / موبايل',
          'اللون: أسود',
          'السعر: 70 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/4113/image_1920',
        colorType: 'Black',
        featured: false,
      },
    ],
  },

  /* ══════════════════════════════
     4. كيبورد + ماوس GK-400 RGB
  ══════════════════════════════ */
  {
    name: 'كيبورد وماوس جيمينج Green Lion GK-400 RGB',
    category: CATEGORY,
    description: 'مجموعة كيبورد وماوس جيمينج سلكية من Green Lion بإضاءة RGB 7 ألوان وأداء احترافي.',
    image: 'https://www.greenlion.net/web/image/product.template/4091/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNGKM4KKEYBK',
    colorType: 'Black',
    featured: true,
    variants: [
      {
        name: 'Green Lion GK-400 RGB Gaming Keyboard + Mouse - أسود',
        brand: BRAND,
        price: 75,
        specifications: [
          'الموديل: GNGKM4KKEYBK',
          'العلامة التجارية: Green Lion',
          'النوع: كيبورد + ماوس جيمينج سلكي',
          '--- الكيبورد ---',
          'الاتصال: USB سلكي Plug & Play',
          'الإضاءة: RGB 7 ألوان - سطوع قابل للتعديل',
          'عمر المفاتيح: 10 مليون ضغطة',
          'مفاتيح وسائط: 10 مفاتيح',
          'طول الكابل: 1.5 متر',
          'المادة: ABS',
          '--- الماوس ---',
          'DPI: 1200 / 1800 / 2400 / 3600',
          'عمر الأزرار: 5 مليون نقرة',
          'طول الكابل: 1.5 متر',
          'المادة: ABS',
          'اللون: أسود',
          'السعر: 75 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/4091/image_1920',
        colorType: 'Black',
        featured: true,
      },
    ],
  },

  /* ══════════════════════════════
     5. ماوس جيمينج G250
  ══════════════════════════════ */
  {
    name: 'ماوس جيمينج Green Lion G250',
    category: CATEGORY,
    description: 'ماوس جيمينج احترافي من Green Lion بدقة 7200 DPI و8 أزرار قابلة للبرمجة وتصميم Honeycomb.',
    image: 'https://www.greenlion.net/web/image/product.template/3999/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNG250GAMBK',
    colorType: 'Black',
    featured: true,
    variants: [
      {
        name: 'Green Lion G250 Gaming Mouse - أسود',
        brand: BRAND,
        price: 89,
        specifications: [
          'الموديل: GNG250GAMBK',
          'العلامة التجارية: Green Lion',
          'النوع: ماوس جيمينج سلكي',
          'الدقة: حتى 7200 DPI',
          'عدد الأزرار: 8 أزرار قابلة للبرمجة',
          'الإضاءة: RGB ملون محيطي',
          'التصميم: Honeycomb خفيف الوزن',
          'زر النار: Fire Button متوفر',
          'عمر الأزرار: 3 مليون نقرة',
          'التصميم: إرغونوميك للراحة الطويلة',
          'التوافق: PC / Laptop',
          'اللون: أسود',
          'السعر: 89 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/3999/image_1920',
        colorType: 'Black',
        featured: true,
      },
    ],
  },

  /* ══════════════════════════════
     6. ماوس جيمينج قابل للشحن
  ══════════════════════════════ */
  {
    name: 'ماوس جيمينج لاسلكي Green Lion قابل للشحن',
    category: CATEGORY,
    description: 'ماوس جيمينج لاسلكي من Green Lion قابل للشحن مع بلوتوث 5.2 ونطاق 10 متر وإضاءة RGB.',
    image: 'https://www.greenlion.net/web/image/product.template/3228/image_1920',
    type: TYPE,
    brand: BRAND,
    modelNumber: 'GNRM5RGMSEBK',
    colorType: 'Black',
    featured: false,
    variants: [
      {
        name: 'Green Lion Rechargeable Gaming Mouse - أسود',
        brand: BRAND,
        price: 37,
        specifications: [
          'الموديل: GNRM5RGMSEBK',
          'العلامة التجارية: Green Lion',
          'النوع: ماوس جيمينج لاسلكي قابل للشحن',
          'الاتصال: بلوتوث 5.2 + 2.4G لاسلكي',
          'DPI: 1200 / 2400 / 3200',
          'عدد الأزرار: 7 أزرار تحكم',
          'نطاق التشغيل: 10 متر',
          'الإضاءة: RGB',
          'الشحن: كابل Type-C',
          'المادة: ABS',
          'اللون: أسود',
          'السعر: 37 ₪',
        ].join('\n'),
        image: 'https://www.greenlion.net/web/image/product.template/3228/image_1920',
        colorType: 'Black',
        featured: false,
      },
    ],
  },
];

async function main() {
  console.log('🎮 إضافة منتجات Gaming من Green Lion...');

  for (const p of gamingProducts) {
    const { variants, ...productData } = p;

    const existing = await prisma.product.findFirst({
      where: { modelNumber: productData.modelNumber, type: TYPE },
    });

    if (existing) {
      console.log(`  ⏭️  موجود مسبقاً: ${productData.name}`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map(v => ({
            name: v.name,
            brand: v.brand,
            price: v.price,
            specifications: v.specifications,
            image: v.image,
            colorType: v.colorType,
            featured: v.featured,
          })),
        },
      },
      include: { variants: true },
    });

    console.log(`  ✅ أضيف: ${created.name} (${created.variants.length} موديل)`);
  }

  console.log('\n✅ اكتمل! تم إضافة منتجات Gaming من Green Lion.');
}

main()
  .catch(e => { console.error('❌ خطأ:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
