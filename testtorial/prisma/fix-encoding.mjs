// prisma/fix-encoding.mjs
// Fixes double-encoded UTF-8 Arabic text in variant specifications and names
// Run with: node prisma/fix-encoding.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Reverses double-UTF-8 encoding:
 * Original Arabic → UTF-8 bytes → each byte treated as Latin-1 codepoint → stored
 * Fix: take each char's codepoint (≤255) as a byte → decode that byte array as UTF-8
 */
function tryFixEncoding(str) {
  if (!str) return str;
  try {
    const codes = [...str].map(c => c.charCodeAt(0));
    // Only attempt fix if all chars are in 0-255 range (i.e., Latin-1 codepoints)
    if (codes.some(c => c > 255)) return str;
    const bytes = Buffer.from(codes);
    const decoded = bytes.toString('utf-8');
    // Verify decoded text actually contains Arabic (U+0600–U+06FF)
    if (/[؀-ۿ]/.test(decoded)) return decoded;
    return str;
  } catch {
    return str;
  }
}

async function main() {
  const variants = await prisma.variant.findMany({
    select: { id: true, name: true, specifications: true, brand: true },
  });

  let updatedCount = 0;

  for (const v of variants) {
    const fixedSpecs = tryFixEncoding(v.specifications);
    const fixedName  = tryFixEncoding(v.name);
    const fixedBrand = tryFixEncoding(v.brand);

    const hasChange =
      fixedSpecs !== v.specifications ||
      fixedName  !== v.name           ||
      fixedBrand !== v.brand;

    if (!hasChange) continue;

    await prisma.variant.update({
      where: { id: v.id },
      data: {
        specifications: fixedSpecs,
        name:           fixedName,
        brand:          fixedBrand,
      },
    });

    if (fixedSpecs !== v.specifications) {
      const preview = fixedSpecs.slice(0, 60).replace(/\n/g, ' ');
      console.log(`[${v.id}] specs fixed → "${preview}..."`);
    }
    if (fixedName !== v.name)  console.log(`[${v.id}] name fixed  → "${fixedName}"`);
    if (fixedBrand !== v.brand) console.log(`[${v.id}] brand fixed → "${fixedBrand}"`);

    updatedCount++;
  }

  // Also fix Product table fields
  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true, category: true },
  });

  for (const p of products) {
    const fixedName = tryFixEncoding(p.name);
    const fixedDesc = tryFixEncoding(p.description);
    const fixedCat  = tryFixEncoding(p.category);

    const hasChange =
      fixedName !== p.name ||
      fixedDesc !== p.description ||
      fixedCat  !== p.category;

    if (!hasChange) continue;

    await prisma.product.update({
      where: { id: p.id },
      data: { name: fixedName, description: fixedDesc, category: fixedCat },
    });

    console.log(`[P${p.id}] "${p.name}" → "${fixedName}"`);
    updatedCount++;
  }

  console.log(`\nDone: ${updatedCount} records fixed.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
