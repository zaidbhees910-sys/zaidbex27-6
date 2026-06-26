import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const similar = await prisma.variant.findMany({
  where: { name: { contains: 'CF4' }, NOT: { image: '' } },
  select: { id: true, name: true, image: true },
  take: 15,
});
console.log('CF4xx with images:');
similar.forEach(v => console.log(` ${v.id} | ${v.name} | ${v.image?.slice(0,80)}`));

// Also check what color patterns exist
const colors = await prisma.variant.findMany({
  where: { id: { in: [214,215,216,217,218,219,220,221] } },
  select: { id: true, name: true, colorType: true },
});
console.log('\nMissing variants color info:');
colors.forEach(v => console.log(` ${v.id} | ${v.name} | colorType: ${v.colorType}`));

await prisma.$disconnect();
