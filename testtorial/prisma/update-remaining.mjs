import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

const COMPAT = {
  'HP Inkjet 937XL CY':   { kind: 'حبر نافث', colorLabel: 'سيان',    printers: ['HP OfficeJet Pro 9730e','9720e','9718e','9710e','9720','9730'] },
  'HP Inkjet 937XL MG':   { kind: 'حبر نافث', colorLabel: 'فوشيا',   printers: ['HP OfficeJet Pro 9730e','9720e','9718e','9710e','9720','9730'] },
  'Epson 103 CY':         { kind: 'حبر نافث', colorLabel: 'سيان',    printers: ['Epson EcoTank L3100','L3110','L3150','L3151','L3156','L3160','L5190','L5196'] },
  'Epson 103 MG':         { kind: 'حبر نافث', colorLabel: 'فوشيا',   printers: ['Epson EcoTank L3100','L3110','L3150','L3151','L3156','L3160','L5190','L5196'] },
  'Epson 103 YL':         { kind: 'حبر نافث', colorLabel: 'أصفر',    printers: ['Epson EcoTank L3100','L3110','L3150','L3151','L3156','L3160','L5190','L5196'] },
  'Xerox B405':           { kind: 'تونر ليزر', colorLabel: 'أسود فقط', printers: ['Xerox B405','B405DN','B405V_DN'] },
  'Xerox B235':           { kind: 'تونر ليزر', colorLabel: 'أسود فقط', printers: ['Xerox B225','B230','B235'] },
  'Epson T7891 XXL BLK':  { kind: 'حبر نافث', colorLabel: 'أسود',    printers: ['Epson WorkForce Pro WF-5110DW','WF-5190DW','WF-5620DWF','WF-5690DWF'] },
  'Epson T7892 XXL CY':   { kind: 'حبر نافث', colorLabel: 'سيان',    printers: ['Epson WorkForce Pro WF-5110DW','WF-5190DW','WF-5620DWF','WF-5690DWF'] },
  'Epson T7893 XXL MG':   { kind: 'حبر نافث', colorLabel: 'فوشيا',   printers: ['Epson WorkForce Pro WF-5110DW','WF-5190DW','WF-5620DWF','WF-5690DWF'] },
  'Epson T7894 XXL YL':   { kind: 'حبر نافث', colorLabel: 'أصفر',    printers: ['Epson WorkForce Pro WF-5110DW','WF-5190DW','WF-5620DWF','WF-5690DWF'] },
  'Pantum DL-410 12K':    { kind: 'تونر ليزر', colorLabel: 'أسود فقط', printers: ['Pantum M7100DN','M7100DW','M7200FDN','M7200FDW','M7300FDN','M7300FDW','P3012DW','P3302DW'] },
  'Kyocera TK-6307 35K':  { kind: 'تونر ليزر', colorLabel: 'أسود فقط', printers: ['Kyocera TASKalfa 3500i','TASKalfa 4500i','TASKalfa 5500i'] },
  'Canon 719H':           { kind: 'تونر ليزر', colorLabel: 'أسود فقط', printers: ['Canon LBP6310dn','LBP6300dn','LBP6650dn','MF411dw','MF416dw','MF419dw','MF5840dn','MF5880dn'] },
  'HP GT53XL BLK':        { kind: 'حبر نافث', colorLabel: 'أسود',    printers: ['HP DeskJet GT 5810','GT 5820','GT 5811','GT 5821','Smart Tank 310','315','319','410','415','419'] },
  'HP GT52 CY':           { kind: 'حبر نافث', colorLabel: 'سيان',    printers: ['HP DeskJet GT 5810','GT 5820','Smart Tank 310','315','319','410','415','419'] },
  'HP GT52 YL':           { kind: 'حبر نافث', colorLabel: 'أصفر',    printers: ['HP DeskJet GT 5810','GT 5820','Smart Tank 310','315','319','410','415','419'] },
  'HP GT52 MG':           { kind: 'حبر نافث', colorLabel: 'فوشيا',   printers: ['HP DeskJet GT 5810','GT 5820','Smart Tank 310','315','319','410','415','419'] },
  'HP Inkjet 712XL BLK':  { kind: 'حبر نافث (DesignJet)', colorLabel: 'أسود', printers: ['HP DesignJet T210','T230','T250','T530','T630','T650','Studio 24in','Studio 36in'] },
  'HP Inkjet 712XL CY':   { kind: 'حبر نافث (DesignJet)', colorLabel: 'سيان', printers: ['HP DesignJet T210','T230','T250','T530','T630','T650','Studio'] },
  'HP Inkjet 712XL YL':   { kind: 'حبر نافث (DesignJet)', colorLabel: 'أصفر', printers: ['HP DesignJet T210','T230','T250','T530','T630','T650','Studio'] },
  'HP Inkjet 712XL MG':   { kind: 'حبر نافث (DesignJet)', colorLabel: 'فوشيا', printers: ['HP DesignJet T210','T230','T250','T530','T630','T650','Studio'] },
  'HP 305 BLK and Color': { kind: 'حبر نافث', colorLabel: 'أسود وملوّن', printers: ['HP DeskJet 2710','2720','2721','2722','2723','2724','2725','2727','DeskJet Plus 4110','4120','4122','4125','4130','4132','4135'] },
  'HP 123 BLK and Color': { kind: 'حبر نافث', colorLabel: 'أسود وملوّن', printers: ['HP DeskJet 2130','2132','2134','2136','Ink Advantage 3630','3632','3634','3636','3638'] },
  'HP 122 BLK and Color': { kind: 'حبر نافث', colorLabel: 'أسود وملوّن', printers: ['HP DeskJet 1000','1050','1051','1055','2000','2050','2050A','3000','3050','3050A','D1660','D2660'] },
  'HP 650 BLK and Color': { kind: 'حبر نافث', colorLabel: 'أسود وملوّن', printers: ['HP DeskJet 1015','1515','2515','2545','2645','3515','3545','Ink Advantage 2515','2545','4515','4645'] },
  'HP 652 BLK and Color': { kind: 'حبر نافث', colorLabel: 'أسود وملوّن', printers: ['HP DeskJet Ink Advantage 1115','2135','2136','3635','3636','3835','4535','4675','5075'] },
  'CF219A Drum':          { kind: 'درام يونيت', colorLabel: 'درام يونيت (طباعة أبيض وأسود)', printers: ['HP LaserJet Pro M102a','M102w','M130a','M130fn','M130fw','M130nw'] },
};

async function main() {
  let done = 0;
  const total = Object.keys(COMPAT).length;
  for (const [model, data] of Object.entries(COMPAT)) {
    const product = await p.product.findFirst({
      where: { modelNumber: model, brand: 'BEC' },
      include: { variants: true },
    });
    if (!product) { console.warn('Not found:', model); continue; }
    const compatBrand = product.variants?.[0]?.brand || 'HP';
    const price = product.variants?.[0]?.price ?? 0;
    const desc  = `${data.kind} BEC أصلي متوافق مع طابعات ${compatBrand.toUpperCase()}.\n\nاللون: ${data.colorLabel}\n\nالطابعات المتوافقة:\n${data.printers.map(x => '• ' + x).join('\n')}`;
    const specs = `الموديل: ${model}\nالعلامة التجارية: BEC\nمتوافق مع: ${compatBrand.toUpperCase()}\nاللون: ${data.colorLabel}\nالنوع: ${data.kind}\nالسعر: ${price} ₪\nالطابعات المتوافقة: ${data.printers.join('، ')}`;
    await p.product.update({
      where: { id: product.id },
      data: {
        description: desc,
        variants: { update: product.variants.map(v => ({ where: { id: v.id }, data: { specifications: specs } })) },
      },
    });
    done++;
    console.log(`✔ ${done}/${total}: ${model}`);
  }
  console.log('\nDone! Updated:', done);
}

main().catch(console.error).finally(() => p.$disconnect());
