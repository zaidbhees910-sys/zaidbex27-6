import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ids = [214, 215, 216, 217, 218, 219, 220, 221];
const IMAGE = '/assets/toner-brand.png';

const updated = await prisma.variant.updateMany({
  where: { id: { in: ids }, image: '' },
  data: { image: IMAGE },
});

console.log(`Updated: ${updated.count} variants → image set to ${IMAGE}`);

// Verify
const check = await prisma.variant.findMany({
  where: { id: { in: ids } },
  select: { id: true, name: true, image: true },
});
check.forEach(v => console.log(` ✓ id:${v.id} | ${v.name} | ${v.image}`));

await prisma.$disconnect();
