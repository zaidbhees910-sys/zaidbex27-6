import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. إضافة GK-400 المفقود لـ Gaming Accessories (id=213)
const parent = await prisma.product.findUnique({ where: { id: 213 }, include: { variants: true } });
const hasGK400 = parent?.variants.some(v => v.name.includes('GK-400'));

if (!hasGK400) {
  const v = await prisma.variant.create({
    data: {
      productId: 213,
      name: 'Green Lion GK-400 RGB Gaming Keyboard + Mouse - أسود',
      brand: 'Green Lion',
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
  });
  console.log('✅ أُضيف GK-400:', v.name);
} else {
  console.log('⏭️  GK-400 موجود مسبقاً');
}

// 2. فحص منتجات Gaming Accessories من نوع مختلف
const others = await prisma.product.findMany({
  where: { name: 'Gaming Accessories', NOT: { id: 213 } },
  include: { variants: true },
});
if (others.length > 0) {
  console.log(`\nمنتجات "Gaming Accessories" أخرى (${others.length}):`);
  for (const p of others) {
    console.log(`  [id=${p.id}] type=${p.type} - ${p.variants.length} أصناف`);
    p.variants.forEach(v => console.log(`    - ${v.name} | ${v.price}₪`));
  }
} else {
  console.log('\nلا توجد منتجات Gaming Accessories أخرى.');
}

// 3. الحالة النهائية
const final = await prisma.product.findUnique({ where: { id: 213 }, include: { variants: true } });
console.log(`\n📦 Gaming Accessories النهائي: ${final.variants.length} أصناف`);
final.variants.forEach(v => console.log(`  - ${v.name} | ${v.price}₪`));

await prisma.$disconnect();
