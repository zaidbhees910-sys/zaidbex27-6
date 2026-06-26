// prisma/restore-corrupted.mjs
// Restores product names and variant names that were incorrectly corrupted by fix-cp1256.mjs
// Run: node prisma/restore-corrupted.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Restore product names (corrupted because they were correctly-stored Arabic Unicode)
  const productRestores = [
    { id: 202, name: 'حبر BEC' },
    { id: 203, name: 'سماعات' },
    { id: 205, name: 'ساعات ذكية' },
    { id: 103, name: 'طابعات' },
  ];

  for (const { id, name } of productRestores) {
    await prisma.product.update({ where: { id }, data: { name } });
    console.log(`[P${id}] name restored → "${name}"`);
  }

  // Restore variant names that had Arabic suffix (- أسود) corrupted
  const variantNameRestores = [
    { id: 225, name: 'Green Lion Shadow ANC Gaming Headset - أسود' },
    { id: 226, name: 'Green Lion GP32X Gaming Headphone - أسود' },
    { id: 227, name: 'Green Lion GP27X Gaming Headphone - أسود' },
    { id: 229, name: 'Green Lion G250 Gaming Mouse - أسود' },
    { id: 230, name: 'Green Lion Rechargeable Gaming Mouse - أسود' },
    { id: 232, name: 'Green Lion GK-400 RGB Gaming Keyboard + Mouse - أسود' },
  ];

  for (const { id, name } of variantNameRestores) {
    await prisma.variant.update({ where: { id }, data: { name } });
    console.log(`[V${id}] name restored → "${name}"`);
  }

  console.log('\nDone. Note: specs for gaming/printer/laptop variants need manual re-entry in admin.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
