import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany({
  where: { type: 'Ink' },
  include: { variants: { select: { id: true, name: true, image: true } } },
});

let missing = 0;
for (const p of products) {
  for (const v of p.variants) {
    if (!v.image || v.image.trim() === '') {
      console.log(`MISSING — product: "${p.name}" | variant id:${v.id} | name:"${v.name}"`);
      missing++;
    }
  }
}
console.log(`\nTotal missing: ${missing} / ${products.flatMap(p=>p.variants).length}`);
await prisma.$disconnect();
