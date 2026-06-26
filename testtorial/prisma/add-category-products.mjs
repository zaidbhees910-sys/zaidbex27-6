import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.$executeRaw`
  ALTER TABLE "HomepageCategory"
  ADD COLUMN IF NOT EXISTS "productIds" TEXT NOT NULL DEFAULT '[]'
`;

console.log('Added productIds column to HomepageCategory ✓');
await prisma.$disconnect();
