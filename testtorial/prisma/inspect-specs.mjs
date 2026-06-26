import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ids = [110,111,112,113,114,225,226,227,229,230,232,234,235];
const variants = await prisma.variant.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, specifications: true } });
for (const v of variants) {
  console.log(`\n=== V${v.id}: ${v.name} ===`);
  console.log(JSON.stringify(v.specifications));
}
await prisma.$disconnect();
