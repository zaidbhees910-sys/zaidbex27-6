import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRaw`ALTER TABLE "AttributeOption" ADD COLUMN IF NOT EXISTS "price" INTEGER`;
console.log('✓ price column added to AttributeOption');
await prisma.$disconnect();
