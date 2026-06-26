// prisma/seed-gaming-mice.mjs
// Run with: node prisma/seed-gaming-mice.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const variants = [
  /* ── Porodo ──────────────────────────────────────── */
  {
    name: 'Porodo Gaming Wired Mouse DPI 7200 – Black',
    brand: 'Porodo',
    price: 69,
    image: 'https://thegreenlion.co/wp-content/uploads/2026/05/PDX322-Porodo-Gaming-Wired-Mouse-DPI-7200-with-RGB-Light-Black-414x414.jpg',
    specifications: [
      'الموديل: PDX322',
      'الاتصال: USB سلكي',
      'DPI: 1200 / 1600 / 2400 / 3200 / 4800 / 7200',
      'الاستشعار: Instant 725F',
      'الأزرار: 6 أزرار قابلة للبرمجة',
      'عمر الأزرار: 3 مليون ضغطة',
      'معدل الاستجابة: 125Hz',
      'طول الكابل: 1.5 متر (مضفر)',
      'الإضاءة: RGB',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Porodo Gaming Wireless Mouse DPI 1600 – Yellow',
    brand: 'Porodo',
    price: 59,
    image: 'https://thegreenlion.co/wp-content/uploads/2026/05/PDX323-YL-Porodo-Gaming-Wireless-Mouse-Gaming-Design-DPI-1600-Yellow-414x414.jpg',
    specifications: [
      'الموديل: PDX323-YL',
      'الاتصال: لاسلكي 2.4GHz',
      'DPI: 1600',
      'التصميم: Gaming Design',
      'اللون: أصفر',
    ].join('\n'),
    colorType: 'Yellow',
  },
  {
    name: 'Porodo Gaming Wireless Mouse DPI 1600 – Pink',
    brand: 'Porodo',
    price: 59,
    image: 'https://thegreenlion.co/wp-content/uploads/2026/05/PDX323PK-Porodo-Gaming-Wireless-Mouse-Gaming-Design-DPI-1600-Pink-414x414.jpg',
    specifications: [
      'الموديل: PDX323-PK',
      'الاتصال: لاسلكي 2.4GHz',
      'DPI: 1600',
      'التصميم: Gaming Design',
      'اللون: وردي',
    ].join('\n'),
    colorType: '',
  },
  {
    name: 'Porodo Gaming BlackHawk 8D Wired Mouse (PWM3389)',
    brand: 'Porodo',
    price: 99,
    image: 'https://thegreenlion.co/wp-content/uploads/2026/05/PDX318-Porodo-Gaming-BlackHawk-8D-Wired-Gaming-Mouse-PWM3389-Sensor-with-TTC-Switch-Black-414x414.jpg',
    specifications: [
      'الموديل: PDX318',
      'الاتصال: USB سلكي',
      'الاستشعار: PWM3389',
      'نوع المفاتيح: TTC Switch',
      'الأزرار: 8',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Porodo Gaming 4 in 1 Combo (Keyboard + Headphone + Mouse + Pad)',
    brand: 'Porodo',
    price: 169,
    image: 'https://thegreenlion.co/wp-content/uploads/2026/05/PDX221-Porodo-Gaming-4-in-1-Combo-with-Keyboard-Headphone-Mouse-and-Mouse-Pad-Black-414x414.jpg',
    specifications: [
      'الموديل: PDX221',
      'المحتويات: لوحة مفاتيح + سماعة + فأرة + لوحة الفأرة',
      'الاتصال: USB سلكي',
      'الإضاءة: RGB',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },

  /* ── Green Lion ──────────────────────────────────── */
  {
    name: 'Green Lion G50 Wireless Mouse – Black',
    brand: 'Green Lion',
    price: 29,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNG50WMSEBK-Green-Lion-G50-Wireless-Mouse-Black-414x414.jpg',
    specifications: [
      'الموديل: GNG50WMSEBK',
      'الاتصال: لاسلكي 2.4GHz',
      'DPI: 1600',
      'المستقبل: USB Nano',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion Wireless Keyboard And Mouse – Black',
    brand: 'Green Lion',
    price: 79,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNWS24GKEYMBK-Green-Lion-Wireless-Keyboard-And-Mouse-Black-414x414.jpg',
    specifications: [
      'الموديل: GNWS24GKEYMBK',
      'النوع: مجموعة كيبورد وفأرة',
      'الاتصال: لاسلكي 2.4GHz',
      'المستقبل: USB Nano موحّد',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion GK-400 RGB Gaming Keyboard + Mouse – Black',
    brand: 'Green Lion',
    price: 149,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNGKM4KKEYBK-Green-Lion-GK-400-RGB-Gaming-Keyboard-Mouse-Black-414x414.webp',
    specifications: [
      'الموديل: GNGKM4KKEYBK',
      'النوع: مجموعة جيمينج',
      'الاتصال: USB سلكي',
      'الإضاءة: RGB',
      'لوحة المفاتيح: GK-400',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion Smart OLED Vertical Mouse – Black',
    brand: 'Green Lion',
    price: 199,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/06/136497-414x414.png',
    specifications: [
      'النوع: فأرة عمودية مريحة',
      'الشاشة: OLED ذكية',
      'الاتصال: لاسلكي',
      'التصميم: Ergonomic Vertical',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion Ergo Grip Vertical Mouse – Black',
    brand: 'Green Lion',
    price: 119,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/06/MOUSE787979757-414x414.png',
    specifications: [
      'النوع: فأرة عمودية مريحة',
      'التصميم: Ergo Grip',
      'الاتصال: لاسلكي',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion Transparent Duo Wireless Keyboard & Mouse – Black',
    brand: 'Green Lion',
    price: 199,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNTRDUOKYMTS-Green-Lion-Transparent-Duo-Wireless-Keyboard-Mouse-Black-414x414.jpg',
    specifications: [
      'الموديل: GNTRDUOKYMTS',
      'النوع: مجموعة كيبورد وفأرة',
      'التصميم: شفاف Transparent',
      'الاتصال: لاسلكي 2.4GHz',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion G266 Beetles Metal Mouse – Gray',
    brand: 'Green Lion',
    price: 149,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNBEMOSEGY-Green-Lion-G266-Beetles-Metal-Mouse-Gray-414x414.webp',
    specifications: [
      'الموديل: G266',
      'الهيكل: معدن Metal Body',
      'التصميم: Beetles',
      'الاتصال: لاسلكي',
      'اللون: رمادي',
    ].join('\n'),
    colorType: '',
  },
  {
    name: 'Green Lion Wireless Turtle Mouse 2400DPI',
    brand: 'Green Lion',
    price: 149,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/05/Green-Lion-Wireless-Turtle-Mouse-2400DPI-414x414.png',
    specifications: [
      'الاتصال: لاسلكي 2.4GHz',
      'DPI: 2400',
      'التصميم: Turtle Shape',
      'الشحن: قابل للشحن USB',
    ].join('\n'),
    colorType: '',
  },
  {
    name: 'Green Lion Wired Gaming Mouse – Black',
    brand: 'Green Lion',
    price: 59,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/9.1-6-414x414.jpg',
    specifications: [
      'الاتصال: USB سلكي',
      'النوع: Gaming',
      'الإضاءة: RGB',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion Rechargeable Gaming Mouse – Black',
    brand: 'Green Lion',
    price: 79,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/8.1-11-414x414.jpg',
    specifications: [
      'الاتصال: لاسلكي',
      'الشحن: USB قابل للشحن',
      'النوع: Gaming',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion G200 Wireless Mouse – Black',
    brand: 'Green Lion',
    price: 49,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/balck-1-1-414x414.jpg',
    specifications: [
      'الموديل: G200',
      'الاتصال: لاسلكي 2.4GHz',
      'المستقبل: USB Nano',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion G100 Wireless Mouse – Gray',
    brand: 'Green Lion',
    price: 39,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/6.1-7-414x414.jpg',
    specifications: [
      'الموديل: G100',
      'الاتصال: لاسلكي 2.4GHz',
      'المستقبل: USB Nano',
      'اللون: رمادي',
    ].join('\n'),
    colorType: '',
  },
  {
    name: 'Green Lion GKM-200 Wireless Combo Keyboard and Mouse – Black',
    brand: 'Green Lion',
    price: 119,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/3.1-3-414x414.webp',
    specifications: [
      'الموديل: GKM-200',
      'النوع: مجموعة كيبورد وفأرة',
      'الاتصال: لاسلكي 2.4GHz',
      'المستقبل: USB Nano موحّد',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion GKM-100 Wired Keyboard and Mouse – Black',
    brand: 'Green Lion',
    price: 59,
    image: 'https://thegreenlion.co/wp-content/uploads/2024/12/2.1-2-414x414.webp',
    specifications: [
      'الموديل: GKM-100',
      'النوع: مجموعة كيبورد وفأرة',
      'الاتصال: USB سلكي',
      'اللون: أسود',
    ].join('\n'),
    colorType: 'Black',
  },
  {
    name: 'Green Lion G730 Wireless Mouse',
    brand: 'Green Lion',
    price: 59,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/05/mouses205256-414x414.png',
    specifications: [
      'الموديل: G730',
      'الاتصال: لاسلكي 2.4GHz',
      'المستقبل: USB Nano',
    ].join('\n'),
    colorType: '',
  },
  {
    name: 'Green Lion Transparent Mouse 2 1600DPI',
    brand: 'Green Lion',
    price: 99,
    image: 'https://thegreenlion.co/wp-content/uploads/2025/05/transparent-414x414.png',
    specifications: [
      'الاتصال: لاسلكي',
      'DPI: 1600',
      'التصميم: شفاف Transparent',
      'الشحن: قابل للشحن',
    ].join('\n'),
    colorType: '',
  },
];

async function main() {
  console.log(`🖱️  Seeding ${variants.length} gaming mice variants...`);

  const product = await prisma.product.create({
    data: {
      name: 'فئران الجيمينج والملحقات',
      category: 'ملحقات الجيمينج',
      description: 'مجموعة متكاملة من فئران الجيمينج والملحقات من Green Lion وPorodo — سلكية ولاسلكية، تصاميم متعددة تناسب كل لاعب.',
      image: 'https://thegreenlion.co/wp-content/uploads/2025/03/GNG50WMSEBK-Green-Lion-G50-Wireless-Mouse-Black-414x414.jpg',
      type: 'Gaming',
      brand: 'Green Lion',
      modelNumber: '',
      colorType: '',
      featured: false,
    },
  });

  console.log(`✅ Product created: id=${product.id}`);

  for (const v of variants) {
    const created = await prisma.variant.create({
      data: {
        productId: product.id,
        name:           v.name,
        brand:          v.brand,
        price:          v.price,
        image:          v.image,
        specifications: v.specifications,
        colorType:      v.colorType,
        stock:          null,
      },
    });
    console.log(`   ✔ ${created.name} — ₪${v.price}`);
  }

  console.log(`\n🎉 Done! ${variants.length} variants added to product id=${product.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
