import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const r = await prisma.$queryRaw`SELECT id, hidden, gallery FROM "Variant" LIMIT 1`;
  console.log('gallery col exists ✅', r);
} catch (e) {
  console.log('gallery col MISSING ❌', e.message);
}
try {
  const r2 = await prisma.$queryRaw`SELECT id, hidden FROM "Product" LIMIT 1`;
  console.log('Product.hidden exists ✅', r2);
} catch (e2) {
  console.log('Product.hidden MISSING ❌', e2.message);
}
// Try actual getProducts logic
try {
  const products = await prisma.product.findMany({ include: { variants: true }, take: 1 });
  console.log('findMany OK, first product:', products[0]?.name, 'variants:', products[0]?.variants?.length);
} catch (e3) {
  console.log('findMany FAIL ❌', e3.message);
}
await prisma.$disconnect();
