import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Check current state first
const products = await prisma.$queryRaw`SELECT id, name, type FROM "Product" WHERE name ILIKE '%gaming%' OR name ILIKE '%GAMING%'`;
console.log('Found:', products);

const r = await prisma.$executeRaw`UPDATE "Product" SET type = 'GamingLaptop', category = 'لابتوب جيمينج' WHERE id = 214`;
console.log('Updated rows:', r);

const check = await prisma.$queryRaw`SELECT id, name, type, category FROM "Product" WHERE id = 214`;
console.log('After update:', check);

await prisma.$disconnect();
