import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ids = [214, 215, 216, 217, 218, 219, 220, 221];
const r = await prisma.variant.updateMany({ where: { id: { in: ids } }, data: { price: 150 } });
console.log(`Updated ${r.count} variants to ₪150`);
await prisma.$disconnect();
