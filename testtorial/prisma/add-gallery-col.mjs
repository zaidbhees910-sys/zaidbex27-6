import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRaw`ALTER TABLE "Variant" ADD COLUMN IF NOT EXISTS "gallery" TEXT NOT NULL DEFAULT '[]'`;
console.log('✓ gallery column added to Variant');
await prisma.$disconnect();
