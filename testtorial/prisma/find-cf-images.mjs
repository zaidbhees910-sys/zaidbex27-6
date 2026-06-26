import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// All ink variants - show name + whether has image
const all = await prisma.variant.findMany({
  where: { product: { type: 'Ink' } },
  select: { id: true, name: true, image: true, colorType: true },
  orderBy: { name: 'asc' },
});

console.log('All ink variants:');
all.forEach(v => {
  const hasImg = v.image && v.image.trim() !== '';
  if (hasImg) console.log(` ✓ id:${v.id} | ${v.name} | ${v.image.slice(0,60)}`);
  else        console.log(` ✗ id:${v.id} | ${v.name} | NO IMAGE`);
});

const withImg = all.filter(v => v.image && v.image.trim());
const noImg   = all.filter(v => !v.image || !v.image.trim());

console.log(`\nWith image: ${withImg.length} | Without: ${noImg.length}`);

// Sample of images to understand URL pattern
console.log('\nSample image URLs:');
withImg.slice(0,5).forEach(v => console.log(` ${v.name}: ${v.image}`));

await prisma.$disconnect();
