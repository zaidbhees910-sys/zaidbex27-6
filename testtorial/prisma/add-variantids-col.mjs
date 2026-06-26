import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRaw`ALTER TABLE "HomepageCategory" ADD COLUMN IF NOT EXISTS "variantIds" TEXT NOT NULL DEFAULT '[]'`;
console.log('Added variantIds column ✓');
await prisma.$disconnect();
