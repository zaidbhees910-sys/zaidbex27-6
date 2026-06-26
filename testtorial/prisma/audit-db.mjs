// audit-db.mjs — يبحث عن أي تلف (U+FFFD) في جميع الحقول النصية
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BAD = '�';

function hasBad(s) { return s && s.includes(BAD); }

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, description: true }
  });

  console.log('=== Products ===');
  for (const p of products) {
    const fields = [];
    if (hasBad(p.name))        fields.push(`name: "${p.name.slice(0,60)}"`);
    if (hasBad(p.category))    fields.push(`category: "${p.category.slice(0,60)}"`);
    if (hasBad(p.description)) fields.push(`description: "${(p.description||'').slice(0,60)}"`);
    if (fields.length) console.log(`[P${p.id}] CORRUPTED — ${fields.join(' | ')}`);
  }

  const variants = await prisma.variant.findMany({
    select: { id: true, name: true, brand: true, specifications: true }
  });

  console.log('\n=== Variants ===');
  for (const v of variants) {
    const fields = [];
    if (hasBad(v.name))           fields.push(`name: "${v.name.slice(0,60)}"`);
    if (hasBad(v.brand))          fields.push(`brand: "${(v.brand||'').slice(0,60)}"`);
    if (hasBad(v.specifications)) fields.push(`specs: "${(v.specifications||'').slice(0,80)}"`);
    if (fields.length) console.log(`[V${v.id}] ${v.name.slice(0,40)} — ${fields.join(' | ')}`);
  }

  console.log('\n=== Summary ===');
  const badP = products.filter(p => hasBad(p.name)||hasBad(p.category)||hasBad(p.description));
  const badV = variants.filter(v => hasBad(v.name)||hasBad(v.brand)||hasBad(v.specifications));
  console.log(`Products corrupted: ${badP.length}`);
  console.log(`Variants corrupted: ${badV.length}`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
