// fix-remaining.mjs — يصلح حقول category و description للمنتجات التالفة
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fixes = [
  {
    id: 103,
    category: 'طابعات',
    description: null, // تركها فارغة (كانت "..." فقط)
  },
  {
    id: 202,
    category: 'حبر',
    description: 'أحبار طباعة أصلية من BEC',
  },
  {
    id: 203,
    category: 'سماعات',
    description: null,
  },
  {
    id: 205,
    category: 'ساعات ذكية',
    description: null,
  },
  {
    id: 213,
    category: 'ملحقات الجيمينج',
    description: 'ملحقات ألعاب من Green Lion — سماعات، كيبورد، ماوس، كونترولر.',
  },
];

async function main() {
  for (const { id, category, description } of fixes) {
    const data = { category };
    if (description !== null) data.description = description;
    await prisma.product.update({ where: { id }, data });
    console.log(`[P${id}] ✓ category="${category}"${description ? ` | description="${description}"` : ''}`);
  }
  console.log('\nDone.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
