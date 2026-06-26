import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ids = [103, 202, 203, 205, 213];
const products = await prisma.product.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, category: true, description: true } });
for (const p of products) {
  console.log(`\n[P${p.id}] name="${p.name}"`);
  console.log(`  category="${p.category}"`);
  console.log(`  description="${p.description}"`);
}
await prisma.$disconnect();
