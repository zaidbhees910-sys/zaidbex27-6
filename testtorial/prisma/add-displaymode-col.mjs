import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRaw`ALTER TABLE "HomepageCategory" ADD COLUMN IF NOT EXISTS "displayMode" TEXT NOT NULL DEFAULT 'products'`;
console.log('Added displayMode column ✓');
await prisma.$disconnect();
