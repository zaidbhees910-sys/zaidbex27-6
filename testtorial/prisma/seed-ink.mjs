// prisma/seed-ink.mjs
// Run with: node prisma/seed-ink.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COLOR_AR = {
  Black: 'ط£ط³ظˆط¯',
  Cyan: 'ط³ظٹط§ظ†',
  Magenta: 'ظپظˆط´ظٹط§',
  Yellow: 'ط£طµظپط±',
  Color: 'ط£ط³ظˆط¯ ظˆظ…ظ„ظˆظ†',
  'Non-color': '',
};

function getName(model, compatBrand, colorType, isInkjet, isDrum) {
  const colorAr = COLOR_AR[colorType] || '';
  const b = compatBrand.toUpperCase();
  if (isDrum) return `ط¯ط±ط§ظ… ظٹظˆظ†ظٹطھ BEC ظ…طھظˆط§ظپظ‚ ظ…ط¹ ${b} - ${model}`;
  if (isInkjet) return colorAr ? `ط­ط¨ط± BEC ${colorAr} ظ„ظ„ط·ط§ط¨ط¹ط§طھ ${b} - ${model}` : `ط­ط¨ط± BEC ظ„ظ„ط·ط§ط¨ط¹ط§طھ ${b} - ${model}`;
  return colorAr ? `طھظˆظ†ط± BEC ${colorAr} ظ„ظ„ط·ط§ط¨ط¹ط§طھ ${b} - ${model}` : `طھظˆظ†ط± BEC ظ„ظ„ط·ط§ط¨ط¹ط§طھ ${b} - ${model}`;
}

function getDesc(model, compatBrand, colorType, isInkjet, isDrum) {
  const colorAr = COLOR_AR[colorType] || '';
  const b = compatBrand.toUpperCase();
  const c = colorAr ? `${colorAr} ` : '';
  if (isDrum) return `ط¯ط±ط§ظ… ظٹظˆظ†ظٹطھ BEC ط£طµظ„ظٹ ظ…طھظˆط§ظپظ‚ ظ…ط¹ ط·ط§ط¨ط¹ط§طھ ${b}. ظ…ظˆط¯ظٹظ„ ${model}. ظٹط¶ظ…ظ† ط·ط¨ط§ط¹ط© ظ†ظ‚ظٹط© ظˆط£ط¯ط§ط،ظ‹ ط«ط§ط¨طھط§ظ‹ ط¹ظ„ظ‰ ط§ظ„ظ…ط¯ظ‰ ط§ظ„ط¨ط¹ظٹط¯.`;
  if (isInkjet) return `ط­ط¨ط± BEC ${c}ط£طµظ„ظٹ ظ„ظ„ط·ط§ط¨ط¹ط§طھ ط§ظ„ظ†ط§ظپط«ط© ظ„ظ„ط­ط¨ط± ظ…ظ† ${b}. ظ…ظˆط¯ظٹظ„ ${model}. ظٹطھظ…ظٹط² ط¨ط«ط¨ط§طھ ط§ظ„ط£ظ„ظˆط§ظ† ظˆط¹ظ…ط± ط§ط³طھط®ط¯ط§ظ… ط·ظˆظٹظ„.`;
  return `طھظˆظ†ط± BEC ${c}ط£طµظ„ظٹ ط¹ط§ظ„ظٹ ط§ظ„ط¬ظˆط¯ط© ظ…طھظˆط§ظپظ‚ ظ…ط¹ ط·ط§ط¨ط¹ط§طھ ${b}. ظ…ظˆط¯ظٹظ„ ${model}. ظٹظˆظپط± ط·ط¨ط§ط¹ط© ط­ط§ط¯ط© ظˆظˆط§ط¶ط­ط© ط¨ظƒط«ط§ظپط© ط­ط¨ط± ظ…ظ…طھط§ط²ط©.`;
}

function getSpecs(model, compatBrand, colorType, price, isInkjet, isDrum) {
  const colorAr = COLOR_AR[colorType] || '';
  const kind = isDrum ? 'ط¯ط±ط§ظ… ظٹظˆظ†ظٹطھ' : (isInkjet ? 'ط­ط¨ط± ظ†ط§ظپط«' : 'طھظˆظ†ط± ظ„ظٹط²ط±');
  const lines = [
    `ط§ظ„ظ…ظˆط¯ظٹظ„: ${model}`,
    `ط§ظ„ط¹ظ„ط§ظ…ط© ط§ظ„طھط¬ط§ط±ظٹط©: BEC`,
    `ظ…طھظˆط§ظپظ‚ ظ…ط¹: ${compatBrand.toUpperCase()}`,
    colorAr ? `ط§ظ„ظ„ظˆظ†: ${colorAr}` : null,
    `ط§ظ„ظ†ظˆط¹: ${kind}`,
    `ط§ظ„ط³ط¹ط±: ${price} â‚ھ`,
  ].filter(Boolean);
  return lines.join('\n');
}

// All 95 BEC ink products from Excel
const inkProducts = [
  // HP Black Toners (rows 2-16)
  { model: 'Universal 435/436/388/278/285 CAN CRG-312/712', compatBrand: 'HP',            colorType: 'Black',     price: 60,  isInkjet: false, isDrum: false, featured: false },
  { model: 'Universal CE505A/CF280A Canon CRG-119/319/719', compatBrand: 'HP',            colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: false },
  { model: 'CF244A',                                         compatBrand: 'HP',            colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: true  },
  { model: 'Universal CF230A/CRG-051',                       compatBrand: 'HP',            colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: true  },
  { model: 'Universal CF230X/CRG-051H',                      compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: false, isDrum: false, featured: false },
  { model: 'W1420X with CHIP',                               compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: false, isDrum: false, featured: false },
  { model: 'Canon 057H with chip',                           compatBrand: 'Canon',         colorType: 'Black',     price: 180, isInkjet: false, isDrum: false, featured: false },
  { model: 'CF259X with Chip',                               compatBrand: 'HP',            colorType: 'Black',     price: 180, isInkjet: false, isDrum: false, featured: false },
  { model: 'CF259X without chip',                            compatBrand: 'HP',            colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: false },
  { model: 'W1106A XXL 5000 pages',                          compatBrand: 'HP',            colorType: 'Black',     price: 150, isInkjet: false, isDrum: false, featured: false },
  { model: 'CF283A/CRG-137/337/737 UNI 2.4K',               compatBrand: 'HP',            colorType: 'Black',     price: 60,  isInkjet: false, isDrum: false, featured: true  },
  { model: 'CF289X With Chip',                               compatBrand: 'HP',            colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'Universal CF287X/CRG-041H',                      compatBrand: 'HP',            colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'W1490X with CHIP',                               compatBrand: 'HP',            colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W1335X',                                         compatBrand: 'HP',            colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  // HP 415A Color Series (rows 17-20)
  { model: 'W2030A BK with chip',                            compatBrand: 'HP',            colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2031A CY with chip',                            compatBrand: 'HP',            colorType: 'Cyan',      price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2032A YL with chip',                            compatBrand: 'HP',            colorType: 'Yellow',    price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2033A MG with chip',                            compatBrand: 'HP',            colorType: 'Magenta',   price: 200, isInkjet: false, isDrum: false, featured: false },
  // HP 220X Series (rows 21-24)
  { model: 'W2210X BK with chip',                            compatBrand: 'HP',            colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2211X CY with chip',                            compatBrand: 'HP',            colorType: 'Cyan',      price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2212X YL with chip',                            compatBrand: 'HP',            colorType: 'Yellow',    price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2213X MG with chip',                            compatBrand: 'HP',            colorType: 'Magenta',   price: 200, isInkjet: false, isDrum: false, featured: false },
  // HP Inkjet 970/971XL (rows 25-28)
  { model: 'HP Inkjet 970XL BLK',                            compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 971XL CY',                             compatBrand: 'HP',            colorType: 'Cyan',      price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 971XL MG',                             compatBrand: 'HP',            colorType: 'Magenta',   price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 971XL YL',                             compatBrand: 'HP',            colorType: 'Yellow',    price: 100, isInkjet: true,  isDrum: false, featured: false },
  // HP W2200X Series (rows 29-32)
  { model: 'W2200X BLK with chip',                           compatBrand: 'HP',            colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2201X CY with chip',                            compatBrand: 'HP',            colorType: 'Cyan',      price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2202X YL with chip',                            compatBrand: 'HP',            colorType: 'Yellow',    price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'W2203X MG with chip',                            compatBrand: 'HP',            colorType: 'Magenta',   price: 250, isInkjet: false, isDrum: false, featured: false },
  // HP High-Yield & Drum (rows 33-35)
  { model: 'CE390X/CC364X UNI',                              compatBrand: 'HP',            colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'CF257X Drum Unit 70K',                           compatBrand: 'HP',            colorType: 'Non-color', price: 400, isInkjet: false, isDrum: true,  featured: false },
  { model: 'CF256X 11.4K',                                   compatBrand: 'HP',            colorType: 'Black',     price: 150, isInkjet: false, isDrum: false, featured: false },
  // HP Inkjet 953XL (rows 36-39)
  { model: 'HP Inkjet 953XL BK',                             compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: true,  isDrum: false, featured: true  },
  { model: 'HP Inkjet 953XL CY',                             compatBrand: 'HP',            colorType: 'Cyan',      price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 953XL MG',                             compatBrand: 'HP',            colorType: 'Magenta',   price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 953XL YL',                             compatBrand: 'HP',            colorType: 'Yellow',    price: 100, isInkjet: true,  isDrum: false, featured: false },
  // Samsung (rows 40-42)
  { model: 'D203L',                                          compatBrand: 'Samsung',       colorType: 'Black',     price: 150, isInkjet: false, isDrum: false, featured: false },
  { model: 'D203U 15K',                                      compatBrand: 'Samsung',       colorType: 'Black',     price: 100, isInkjet: false, isDrum: false, featured: false },
  { model: 'MLT-D111L',                                      compatBrand: 'Samsung',       colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: false },
  // Xerox (rows 43-45)
  { model: 'XER 3020/3025',                                  compatBrand: 'Xerox',         colorType: 'Black',     price: 60,  isInkjet: false, isDrum: false, featured: false },
  { model: 'XER 3330 15K',                                   compatBrand: 'Xerox',         colorType: 'Black',     price: 200, isInkjet: false, isDrum: false, featured: false },
  { model: 'XER 3330 DRUM',                                  compatBrand: 'Xerox',         colorType: 'Non-color', price: 250, isInkjet: false, isDrum: true,  featured: false },
  // More HP (rows 46-50)
  { model: 'W1500A with CHIP',                               compatBrand: 'HP',            colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: false },
  { model: 'W1331X with chip',                               compatBrand: 'HP',            colorType: 'Black',     price: 120, isInkjet: false, isDrum: false, featured: false },
  { model: 'MP 6054 48K',                                    compatBrand: 'Ricoh',         colorType: 'Black',     price: 300, isInkjet: false, isDrum: false, featured: false },
  { model: 'TN515',                                          compatBrand: 'Konica Minolta',colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'W1390X with chip',                               compatBrand: 'HP',            colorType: 'Black',     price: 120, isInkjet: false, isDrum: false, featured: false },
  // HP 219X Color Series (rows 51-54)
  { model: 'HP 219X Black W2190X with chip',                 compatBrand: 'HP',            colorType: 'Black',     price: 300, isInkjet: false, isDrum: false, featured: false },
  { model: 'HP 219X Cyan W2191X',                            compatBrand: 'HP',            colorType: 'Cyan',      price: 300, isInkjet: false, isDrum: false, featured: false },
  { model: 'HP 219X Yellow W2192X',                          compatBrand: 'HP',            colorType: 'Yellow',    price: 300, isInkjet: false, isDrum: false, featured: false },
  { model: 'HP 219X Magenta W2193X',                         compatBrand: 'HP',            colorType: 'Magenta',   price: 300, isInkjet: false, isDrum: false, featured: false },
  // Canon (row 55)
  { model: 'Canon 070H',                                     compatBrand: 'Canon',         colorType: 'Black',     price: 150, isInkjet: false, isDrum: false, featured: true  },
  // Brother (rows 56-59)
  { model: 'Brother TN-3410',                                compatBrand: 'Brother',       colorType: 'Black',     price: 180, isInkjet: false, isDrum: false, featured: false },
  { model: 'Brother Drum 3420',                              compatBrand: 'Brother',       colorType: 'Non-color', price: 120, isInkjet: false, isDrum: true,  featured: false },
  { model: 'Brother TN-2220',                                compatBrand: 'Brother',       colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: true  },
  { model: 'Brother TN-2420',                                compatBrand: 'Brother',       colorType: 'Black',     price: 80,  isInkjet: false, isDrum: false, featured: false },
  // Samsung High-Yield (rows 60-61)
  { model: 'Samsung 704L',                                   compatBrand: 'Samsung',       colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  { model: 'Samsung 707L',                                   compatBrand: 'Samsung',       colorType: 'Black',     price: 250, isInkjet: false, isDrum: false, featured: false },
  // HP Inkjet 963XL (rows 62-65)
  { model: 'HP Inkjet 963XL BLK',                            compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 963XL CY',                             compatBrand: 'HP',            colorType: 'Cyan',      price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 963XL YL',                             compatBrand: 'HP',            colorType: 'Yellow',    price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 963XL MG',                             compatBrand: 'HP',            colorType: 'Magenta',   price: 100, isInkjet: true,  isDrum: false, featured: false },
  // HP Inkjet 937XL (rows 66-69)
  { model: 'HP Inkjet 937XL BLK',                            compatBrand: 'HP',            colorType: 'Black',     price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 937XL YL',                             compatBrand: 'HP',            colorType: 'Yellow',    price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 937XL CY',                             compatBrand: 'HP',            colorType: 'Cyan',      price: 100, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 937XL MG',                             compatBrand: 'HP',            colorType: 'Magenta',   price: 100, isInkjet: true,  isDrum: false, featured: false },
  // Epson 103 (rows 70-73)
  { model: 'Epson 103 BLK',                                  compatBrand: 'Epson',         colorType: 'Black',     price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson 103 CY',                                   compatBrand: 'Epson',         colorType: 'Cyan',      price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson 103 MG',                                   compatBrand: 'Epson',         colorType: 'Magenta',   price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson 103 YL',                                   compatBrand: 'Epson',         colorType: 'Yellow',    price: 30,  isInkjet: true,  isDrum: false, featured: false },
  // Xerox (rows 74-75)
  { model: 'Xerox B405',                                     compatBrand: 'Xerox',         colorType: 'Black',     price: 300, isInkjet: false, isDrum: false, featured: false },
  { model: 'Xerox B235',                                     compatBrand: 'Xerox',         colorType: 'Black',     price: 300, isInkjet: false, isDrum: false, featured: false },
  // Epson T789X XXL (rows 76-79)
  { model: 'Epson T7891 XXL BLK',                            compatBrand: 'Epson',         colorType: 'Black',     price: 150, isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson T7892 XXL CY',                             compatBrand: 'Epson',         colorType: 'Cyan',      price: 150, isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson T7893 XXL MG',                             compatBrand: 'Epson',         colorType: 'Magenta',   price: 150, isInkjet: true,  isDrum: false, featured: false },
  { model: 'Epson T7894 XXL YL',                             compatBrand: 'Epson',         colorType: 'Yellow',    price: 150, isInkjet: true,  isDrum: false, featured: false },
  // Other brands (rows 80-82)
  { model: 'Pantum DL-410 12K',                              compatBrand: 'Pantum',        colorType: 'Black',     price: 220, isInkjet: false, isDrum: false, featured: false },
  { model: 'Kyocera TK-6307 35K',                            compatBrand: 'Kyocera',       colorType: 'Black',     price: 400, isInkjet: false, isDrum: false, featured: false },
  { model: 'Canon 719H',                                     compatBrand: 'Canon',         colorType: 'Black',     price: 100, isInkjet: false, isDrum: false, featured: false },
  // HP GT Series (rows 83-86)
  { model: 'HP GT53XL BLK',                                  compatBrand: 'HP',            colorType: 'Black',     price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP GT52 CY',                                     compatBrand: 'HP',            colorType: 'Cyan',      price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP GT52 YL',                                     compatBrand: 'HP',            colorType: 'Yellow',    price: 30,  isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP GT52 MG',                                     compatBrand: 'HP',            colorType: 'Magenta',   price: 30,  isInkjet: true,  isDrum: false, featured: false },
  // HP Inkjet 712XL (rows 87-90)
  { model: 'HP Inkjet 712XL BLK',                            compatBrand: 'HP',            colorType: 'Black',     price: 120, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 712XL CY',                             compatBrand: 'HP',            colorType: 'Cyan',      price: 120, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 712XL YL',                             compatBrand: 'HP',            colorType: 'Yellow',    price: 120, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP Inkjet 712XL MG',                             compatBrand: 'HP',            colorType: 'Magenta',   price: 120, isInkjet: true,  isDrum: false, featured: false },
  // HP Multipack (rows 91-95)
  { model: 'HP 305 BLK and Color',                           compatBrand: 'HP',            colorType: 'Color',     price: 180, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP 123 BLK and Color',                           compatBrand: 'HP',            colorType: 'Color',     price: 150, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP 122 BLK and Color',                           compatBrand: 'HP',            colorType: 'Color',     price: 150, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP 650 BLK and Color',                           compatBrand: 'HP',            colorType: 'Color',     price: 120, isInkjet: true,  isDrum: false, featured: false },
  { model: 'HP 652 BLK and Color',                           compatBrand: 'HP',            colorType: 'Color',     price: 120, isInkjet: true,  isDrum: false, featured: false },
  // HP Drum (row 96)
  { model: 'CF219A Drum',                                    compatBrand: 'HP',            colorType: 'Non-color', price: 100, isInkjet: false, isDrum: true,  featured: false },
];

async function main() {
  console.log('Starting BEC ink products import...');

  // Check if already imported to avoid duplicates
  const existing = await prisma.product.count({ where: { brand: 'BEC', type: 'Ink' } });
  if (existing > 0) {
    console.log(`Found ${existing} BEC ink products already in database. Skipping import.`);
    console.log('To re-import, delete existing BEC ink products first.');
    return;
  }

  let created = 0;
  for (const p of inkProducts) {
    const name = getName(p.model, p.compatBrand, p.colorType, p.isInkjet, p.isDrum);
    const desc = getDesc(p.model, p.compatBrand, p.colorType, p.isInkjet, p.isDrum);
    const specs = getSpecs(p.model, p.compatBrand, p.colorType, p.price, p.isInkjet, p.isDrum);

    await prisma.product.create({
      data: {
        name,
        brand: 'BEC',
        category: 'ط­ط¨ط± ظˆطھظˆظ†ط±',
        description: desc,
        image: '/assets/toner-brand.png',
        type: 'Ink',
        modelNumber: p.model,
        colorType: p.colorType,
        featured: p.featured,
        variants: {
          create: [{
            name: p.model,
            brand: p.compatBrand,
            price: p.price,
            specifications: specs,
            image: '/assets/toner-brand.png',
          }],
        },
      },
    });
    created++;
    process.stdout.write(`\râœ“ Imported ${created}/${inkProducts.length}: ${name.substring(0, 60)}`);
  }

  console.log(`\n\nDone! Created ${created} BEC ink products.`);
  console.log(`Featured products: ${inkProducts.filter(p => p.featured).length}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

