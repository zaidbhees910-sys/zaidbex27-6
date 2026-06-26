import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const v = await prisma.variant.findFirst({ where: { id: 169 }, select: { specifications: true } });
const s = v.specifications;
console.log('Raw length:', s.length);
console.log('First 60 chars:');
console.log(s.slice(0, 60));
console.log('\nCodepoints of first 20 chars:');
for (let i = 0; i < Math.min(20, s.length); i++) {
  const cp = s.charCodeAt(i);
  console.log(`  [${i}] "${s[i]}" U+${cp.toString(16).padStart(4,'0')} (${cp}) ${cp > 255 ? '<ARABIC>' : '<LATIN>'}`);
}
await prisma.$disconnect();
