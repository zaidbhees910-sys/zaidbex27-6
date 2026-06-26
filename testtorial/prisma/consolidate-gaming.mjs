// prisma/consolidate-gaming.mjs
// دمج كل منتجات Gaming كأصناف تحت منتج واحد "Gaming Accessories"
// Run with: node prisma/consolidate-gaming.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎮 دمج منتجات Gaming تحت Gaming Accessories...\n');

  // 1. إنشاء أو إيجاد المنتج الرئيسي
  let parent = await prisma.product.findFirst({
    where: { type: 'Gaming', name: 'Gaming Accessories' },
  });

  if (!parent) {
    parent = await prisma.product.create({
      data: {
        name: 'Gaming Accessories',
        category: 'ملحقات الجيمينج',
        description: 'مجموعة ملحقات الجيمينج من Green Lion — سماعات، كيبورد، ماوس، وأكثر.',
        image: '',
        type: 'Gaming',
        brand: 'Green Lion',
        modelNumber: '',
        colorType: '',
        featured: true,
      },
    });
    console.log(`✅ أُنشئ المنتج الرئيسي: ${parent.name} (id: ${parent.id})\n`);
  } else {
    console.log(`📦 المنتج الرئيسي موجود مسبقاً: ${parent.name} (id: ${parent.id})\n`);
  }

  // 2. جلب كل منتجات Gaming ما عدا الرئيسي
  const gamingProducts = await prisma.product.findMany({
    where: { type: 'Gaming', NOT: { id: parent.id } },
    include: { variants: true },
  });

  if (gamingProducts.length === 0) {
    console.log('⚠️  لا توجد منتجات Gaming لنقلها.');
    return;
  }

  console.log(`📋 ${gamingProducts.length} منتج سيتم نقله:\n`);

  let moved = 0;
  for (const p of gamingProducts) {
    try {
      if (p.variants.length > 0) {
        // نقل الأصناف الموجودة للمنتج الرئيسي
        await prisma.variant.updateMany({
          where: { productId: p.id },
          data: { productId: parent.id },
        });
        console.log(`  ✅ نُقل "${p.name}" — ${p.variants.length} صنف`);
      } else {
        // إذا لم يكن هناك أصناف، أنشئ صنف من بيانات المنتج نفسه
        await prisma.variant.create({
          data: {
            productId: parent.id,
            name: p.name,
            brand: p.brand || 'Green Lion',
            price: 0,
            specifications: p.description || '',
            image: p.image || '',
            colorType: p.colorType || '',
          },
        });
        console.log(`  ✅ أُنشئ صنف من "${p.name}" (لم يكن له أصناف)`);
      }

      // حذف المنتج الفردي
      await prisma.product.delete({ where: { id: p.id } });
      moved++;
    } catch (e) {
      console.error(`  ❌ خطأ في نقل "${p.name}":`, e.message);
    }
  }

  const finalParent = await prisma.product.findUnique({
    where: { id: parent.id },
    include: { variants: true },
  });

  console.log(`\n✅ اكتمل!`);
  console.log(`   📦 المنتج الرئيسي: "${finalParent.name}"`);
  console.log(`   🔢 إجمالي الأصناف: ${finalParent.variants.length}`);
  console.log(`   🗑️  منتجات محذوفة: ${moved}`);
}

main()
  .catch(e => { console.error('❌ خطأ:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
