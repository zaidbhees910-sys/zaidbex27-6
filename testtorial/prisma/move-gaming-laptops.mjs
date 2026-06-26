import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Find the variants
const variants = await prisma.$queryRaw`
  SELECT id, name, "productId" FROM "Variant"
  WHERE name ILIKE '%Legion 5 15IRX10%' OR name ILIKE '%Legion Pro 5 16IAX10%'
`;
console.log('Found variants:', variants);

if (variants.length === 0) {
  console.log('No variants found — check names');
  process.exit(1);
}

// 2. Create new product "GAMING LAPTOPS"
const [existing] = await prisma.$queryRaw`
  SELECT id FROM "Product" WHERE name = 'GAMING LAPTOPS' LIMIT 1
`;
let newProductId;
if (existing) {
  newProductId = existing.id;
  console.log('Product GAMING LAPTOPS already exists, id:', newProductId);
} else {
  const [created] = await prisma.$queryRaw`
    INSERT INTO "Product" (name, category, description, image, type, brand, "modelNumber", "colorType", featured, hidden, "createdAt", "updatedAt")
    VALUES ('GAMING LAPTOPS', 'لابتوب جيمنج', '', '', 'Gaming', '', '', '', false, false, NOW(), NOW())
    RETURNING id
  `;
  newProductId = created.id;
  console.log('Created GAMING LAPTOPS product, id:', newProductId);
}

// 3. Move variants to new product
const ids = variants.map(v => v.id);
await prisma.$executeRaw`
  UPDATE "Variant" SET "productId" = ${newProductId} WHERE id = ANY(${ids}::int[])
`;
console.log(`✓ Moved ${ids.length} variants to GAMING LAPTOPS (id: ${newProductId})`);

await prisma.$disconnect();
