import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS "HomepageSettings" (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )
`;

await prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS "HomepageBanner" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT NOT NULL DEFAULT '',
    "ctaText" TEXT NOT NULL DEFAULT 'عرض المنتجات',
    "ctaLink" TEXT NOT NULL DEFAULT '/products',
    "bgColor" TEXT NOT NULL DEFAULT '#2563eb',
    image TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INT NOT NULL DEFAULT 0
  )
`;

await prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS "HomepageCategory" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '/products',
    icon TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INT NOT NULL DEFAULT 0
  )
`;

const rows = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "HomepageCategory"`;
if (Number(rows[0].count) === 0) {
  await prisma.$executeRaw`
    INSERT INTO "HomepageCategory" (title, description, link, icon, "sortOrder") VALUES
    ('الطباعة والأحبار', 'أحبار BEC الأصلية وطابعات HP وCanon وBrother', '/products?type=Ink', '🖨️', 1),
    ('Gaming', 'لابتوبات جيمينج وإكسسوارات Gaming احترافية', '/products?type=Gaming', '🎮', 2),
    ('أجهزة الكمبيوتر', 'لابتوبات وأجهزة بأحدث المواصفات', '/products?type=Device', '💻', 3),
    ('الإكسسوارات', 'سماعات وملحقات تقنية متنوعة', '/products?type=Other', '🎧', 4)
  `;
  console.log('Default categories seeded ✓');
}

console.log('Homepage tables ready ✓');
await prisma.$disconnect();
