import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRaw`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN NOT NULL DEFAULT false`;
await prisma.$executeRaw`ALTER TABLE "Variant" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN NOT NULL DEFAULT false`;
console.log('✓ hidden columns added');
await prisma.$disconnect();
