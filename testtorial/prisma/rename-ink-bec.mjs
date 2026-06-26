// prisma/rename-ink-bec.mjs
// Renames all ink variant names to start with "BEC"
// - Names starting with a brand word (Universal, HP, Brother, etc.) → remove first word, add "BEC "
// - All other names → prepend "BEC "
// Run with: node prisma/rename-ink-bec.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BRAND_WORDS = [
  'Universal', 'HP', 'Brother', 'Samsung', 'Canon',
  'Epson', 'Xerox', 'Pantum', 'Kyocera',
];

function transformName(name) {
  const trimmed = name.trim();
  if (trimmed.toLowerCase().startsWith('bec ')) return trimmed;

  for (const brand of BRAND_WORDS) {
    if (trimmed.toLowerCase().startsWith(brand.toLowerCase() + ' ')) {
      return 'BEC ' + trimmed.slice(brand.length + 1).trim();
    }
  }

  return 'BEC ' + trimmed;
}

async function main() {
  const inkProducts = await prisma.product.findMany({
    where: { type: 'Ink' },
    include: { variants: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const product of inkProducts) {
    for (const variant of product.variants) {
      const newName = transformName(variant.name);
      if (newName === variant.name) {
        skipped++;
        continue;
      }
      await prisma.variant.update({
        where: { id: variant.id },
        data: { name: newName },
      });
      console.log(`  [${variant.id}] "${variant.name}" → "${newName}"`);
      updated++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} already correct.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
