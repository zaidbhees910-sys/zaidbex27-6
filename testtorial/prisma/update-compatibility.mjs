// prisma/update-compatibility.mjs
// Adds printer compatibility info + corrects color labels for all 95 BEC ink products
// Run with: node prisma/update-compatibility.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// Compatibility data  (model → { printers[], kind, colorLabel })
// kind:  'تونر ليزر' | 'حبر نافث' | 'درام يونيت'
// colorLabel: Arabic description used in description + specs
// ─────────────────────────────────────────────────────────────────────────────
const COMPAT = {

  /* ── HP Laser Toners (Black) ────────────────────────────────────────────── */
  'Universal 435/436/388/278/285 CAN CRG-312/712': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet P1005', 'P1006', 'P1007', 'P1008', 'P1102', 'P1102w', 'M1132', 'M1136', 'M1212nf', 'M1213nf', 'M1216nfh', 'M1217nfw', 'Canon LBP3010', 'LBP3018', 'LBP3100', 'LBP3150'],
  },
  'Universal CE505A/CF280A Canon CRG-119/319/719': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet P2035', 'P2035n', 'P2055d', 'P2055dn', 'P2055x', 'Pro 400 M401d', 'M401dn', 'M401n', 'MFP M425dn', 'M425dw', 'Canon LBP6300dn', 'LBP6650dn', 'MF414dw', 'MF416dw'],
  },
  'CF244A': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro M15a', 'M15w', 'M28a', 'M28w', 'M29a', 'M29w'],
  },
  'Universal CF230A/CRG-051': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro M203d', 'M203dn', 'M203dw', 'MFP M227d', 'M227fdn', 'M227fdw', 'M227sdn', 'Canon imageCLASS LBP162dw', 'MF264dw', 'MF267dw', 'MF269dw'],
  },
  'Universal CF230X/CRG-051H': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro M203d', 'M203dn', 'M203dw', 'MFP M227d', 'M227fdn', 'M227fdw', 'Canon imageCLASS LBP162dw', 'MF264dw', 'MF267dw', 'MF269dw'],
  },
  'W1420X with CHIP': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet MFP M110we', 'M139we', 'M140we', 'M141we', 'M141a', 'M140a'],
  },
  'CF259X with Chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro M404d', 'M404dn', 'M404dw', 'M404n', 'MFP M428dw', 'M428fdn', 'M428fdw'],
  },
  'CF259X without chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro M404d', 'M404dn', 'M404dw', 'M404n', 'MFP M428dw', 'M428fdn', 'M428fdw'],
  },
  'W1106A XXL 5000 pages': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP Laser 107a', '107r', '107w', 'MFP 135a', '135r', '135w', '137fnw'],
  },
  'CF283A/CRG-137/337/737 UNI 2.4K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro MFP M125a', 'M125nw', 'M126a', 'M126nw', 'M127fn', 'M127fw', 'M128fn', 'M128fw', 'Canon MF211', 'MF212w', 'MF215', 'MF217w', 'LBP151dw'],
  },
  'CF289X With Chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Enterprise M507dn', 'M507dng', 'M507n', 'M507x', 'MFP M528dn', 'M528f', 'M528z'],
  },
  'Universal CF287X/CRG-041H': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Enterprise M506dn', 'M506n', 'M506x', 'MFP M527dn', 'M527f', 'M527z', 'Canon LBP654Cdw', 'LBP653Cdw', 'MF641Cw', 'MF642Cdw'],
  },
  'W1490X with CHIP': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro 4003d', '4003dn', '4003dw', '4003n', 'MFP 4103dw', '4103fdn', '4103fdw'],
  },
  'W1335X': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet MFP M438nda', 'M442dn', 'M443nda'],
  },
  'CE390X/CC364X UNI': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Enterprise 600 M601n', 'M601dn', 'M602n', 'M602dn', 'M602x', 'M603n', 'M603dn', 'P4515n', 'P4515tn', 'P4515x'],
  },
  'CF256X 11.4K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Enterprise M436dn', 'M436nda', 'M436n'],
  },
  'W1500A with CHIP': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP Laser 150a', '150nw', 'MFP 178nw', '178nwg', '179fnw', '179fwg'],
  },
  'W1331X with chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet Pro 408dn', 'MFP 432fdn'],
  },
  'W1390X with chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP LaserJet MFP M440dn', 'M440nda', 'M441dn'],
  },

  /* ── HP 415A Color Series ───────────────────────────────────────────────── */
  'W2030A BK with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أسود (طقم ألوان 415A)',
    printers: ['HP Color LaserJet Pro M454dw', 'M454dn', 'MFP M479dw', 'M479fnw', 'M479fdw', 'M479fdn'],
  },
  'W2031A CY with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'سيان (طقم ألوان 415A)',
    printers: ['HP Color LaserJet Pro M454dw', 'M454dn', 'MFP M479dw', 'M479fnw', 'M479fdw', 'M479fdn'],
  },
  'W2032A YL with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أصفر (طقم ألوان 415A)',
    printers: ['HP Color LaserJet Pro M454dw', 'M454dn', 'MFP M479dw', 'M479fnw', 'M479fdw', 'M479fdn'],
  },
  'W2033A MG with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'فوشيا (طقم ألوان 415A)',
    printers: ['HP Color LaserJet Pro M454dw', 'M454dn', 'MFP M479dw', 'M479fnw', 'M479fdw', 'M479fdn'],
  },

  /* ── HP 220X Color Series ───────────────────────────────────────────────── */
  'W2210X BK with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أسود (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn', 'Flow MFP M577c', 'M577f', 'M577z'],
  },
  'W2211X CY with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'سيان (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },
  'W2212X YL with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أصفر (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },
  'W2213X MG with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'فوشيا (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },

  /* ── HP Inkjet 970/971XL ────────────────────────────────────────────────── */
  'HP Inkjet 970XL BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['HP OfficeJet Pro X451dw', 'X476dw', 'X551dw', 'X576dw'],
  },
  'HP Inkjet 971XL CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['HP OfficeJet Pro X451dw', 'X476dw', 'X551dw', 'X576dw'],
  },
  'HP Inkjet 971XL MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['HP OfficeJet Pro X451dw', 'X476dw', 'X551dw', 'X576dw'],
  },
  'HP Inkjet 971XL YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['HP OfficeJet Pro X451dw', 'X476dw', 'X551dw', 'X576dw'],
  },

  /* ── HP W2200X Series ───────────────────────────────────────────────────── */
  'W2200X BLK with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أسود (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },
  'W2201X CY with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'سيان (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },
  'W2202X YL with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أصفر (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },
  'W2203X MG with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'فوشيا (طقم ألوان 220X)',
    printers: ['HP Color LaserJet Enterprise M553dn', 'M553dh', 'M553x', 'M552dn'],
  },

  /* ── HP Drum Units ──────────────────────────────────────────────────────── */
  'CF257X Drum Unit 70K': {
    kind: 'درام يونيت', colorLabel: 'درام يونيت (طباعة أبيض وأسود)',
    printers: ['HP LaserJet Enterprise M436dn', 'M436nda', 'M436n', 'M437', 'M439'],
  },
  'CF219A Drum': {
    kind: 'درام يونيت', colorLabel: 'درام يونيت (طباعة أبيض وأسود)',
    printers: ['HP LaserJet Pro M102a', 'M102w', 'M130a', 'M130fn', 'M130fw', 'M130nw'],
  },

  /* ── HP Inkjet 953XL ────────────────────────────────────────────────────── */
  'HP Inkjet 953XL BK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['HP OfficeJet Pro 7720', '7730', '7740', '8210', '8218', '8710', '8715', '8718', '8720', '8725', '8730', '8740'],
  },
  'HP Inkjet 953XL CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['HP OfficeJet Pro 7720', '7730', '7740', '8710', '8715', '8720', '8730'],
  },
  'HP Inkjet 953XL MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['HP OfficeJet Pro 7720', '7730', '7740', '8710', '8715', '8720', '8730'],
  },
  'HP Inkjet 953XL YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['HP OfficeJet Pro 7720', '7730', '7740', '8710', '8715', '8720', '8730'],
  },

  /* ── Samsung ────────────────────────────────────────────────────────────── */
  'D203L': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Samsung ProXpress SL-M4020ND', 'SL-M4020NX', 'SL-M4025ND', 'SL-M4070FR', 'SL-M4070FX'],
  },
  'D203U 15K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Samsung ProXpress SL-M3320ND', 'SL-M3820DW', 'SL-M4020ND', 'SL-M4070FR'],
  },
  'MLT-D111L': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Samsung Xpress M2020', 'M2020W', 'M2022', 'M2022W', 'M2026', 'M2026W', 'M2070', 'M2070F', 'M2070FW', 'M2070W'],
  },
  'Samsung 704L': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Samsung MultiXpress SL-K4250LX', 'SL-K4300LX', 'SL-K4350LX'],
  },
  'Samsung 707L': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Samsung MultiXpress SL-K4300LX', 'SL-K4350LX', 'SL-K2200', 'SL-K2200ND'],
  },

  /* ── Xerox ──────────────────────────────────────────────────────────────── */
  'XER 3020/3025': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Xerox Phaser 3020', 'WorkCentre 3025', 'WorkCentre 3025BI', 'WorkCentre 3025NI'],
  },
  'XER 3330 15K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Xerox WorkCentre 3335', 'WorkCentre 3345', 'Phaser 3330'],
  },
  'XER 3330 DRUM': {
    kind: 'درام يونيت', colorLabel: 'درام يونيت (طباعة أبيض وأسود)',
    printers: ['Xerox WorkCentre 3335', 'WorkCentre 3345', 'Phaser 3330'],
  },
  'Xerox B405': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Xerox B405', 'B405DN', 'B405V_DN'],
  },
  'Xerox B235': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Xerox B225', 'B230', 'B235'],
  },

  /* ── More HP ────────────────────────────────────────────────────────────── */
  'W1150A with CHIP': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP Laser 107a', '107r', 'MFP 135a', 'MFP 137fnw'],
  },
  'W1500A with CHIP': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['HP Laser 150a', '150nw', 'MFP 178nw', '178nwg', '179fnw', '179fwg'],
  },

  /* ── Ricoh ──────────────────────────────────────────────────────────────── */
  'MP 6054 48K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Ricoh MP 4054', 'MP 5054', 'MP 6054', 'MP 4055', 'MP 5055', 'MP 6055'],
  },

  /* ── Konica Minolta ─────────────────────────────────────────────────────── */
  'TN515': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Konica Minolta bizhub 458e', 'bizhub 558e', 'bizhub 658e'],
  },

  /* ── HP 219X Color Series ───────────────────────────────────────────────── */
  'HP 219X Black W2190X with chip': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أسود (طقم ألوان 219X)',
    printers: ['HP Color LaserJet Pro M155a', 'M183fw', 'M182n', 'M180n', 'M182fw'],
  },
  'HP 219X Cyan W2191X': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'سيان (طقم ألوان 219X)',
    printers: ['HP Color LaserJet Pro M155a', 'M183fw', 'M182n', 'M180n'],
  },
  'HP 219X Yellow W2192X': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'أصفر (طقم ألوان 219X)',
    printers: ['HP Color LaserJet Pro M155a', 'M183fw', 'M182n', 'M180n'],
  },
  'HP 219X Magenta W2193X': {
    kind: 'تونر ليزر ملوّن', colorLabel: 'فوشيا (طقم ألوان 219X)',
    printers: ['HP Color LaserJet Pro M155a', 'M183fw', 'M182n', 'M180n'],
  },

  /* ── Canon ──────────────────────────────────────────────────────────────── */
  'Canon 057H with chip': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Canon imageCLASS MF449dw', 'MF445dw', 'MF443dw', 'MF446x', 'LBP223dw', 'LBP226dw', 'LBP227dw'],
  },
  'Canon 070H': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Canon imageCLASS MF465dw', 'MF462dw', 'LBP247dw', 'LBP246dw', 'LBP243dw'],
  },
  'Canon 719H': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Canon LBP6310dn', 'LBP6300dn', 'LBP6650dn', 'MF411dw', 'MF416dw', 'MF419dw', 'MF5840dn', 'MF5880dn'],
  },

  /* ── Brother ────────────────────────────────────────────────────────────── */
  'Brother TN-3410': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Brother HL-L5200DW', 'HL-L5200DWT', 'HL-L6200DW', 'HL-L6300DW', 'MFC-L5900DW', 'MFC-L6900DW', 'DCP-L5600DN', 'DCP-L6600DW'],
  },
  'Brother Drum 3420': {
    kind: 'درام يونيت', colorLabel: 'درام يونيت (طباعة أبيض وأسود)',
    printers: ['Brother HL-L5100DN', 'HL-L5200DW', 'HL-L6200DW', 'MFC-L5900DW', 'MFC-L6900DW', 'DCP-L5500DN'],
  },
  'Brother TN-2220': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Brother HL-2240', 'HL-2240D', 'HL-2250DN', 'HL-2270DW', 'MFC-7360N', 'MFC-7460DN', 'MFC-7860DW', 'DCP-7060D', 'DCP-7065DN'],
  },
  'Brother TN-2420': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Brother HL-L2310D', 'HL-L2350DW', 'HL-L2370DN', 'HL-L2375DW', 'MFC-L2710DW', 'MFC-L2730DW', 'MFC-L2750DW', 'DCP-L2510D', 'DCP-L2530DW', 'DCP-L2550DN'],
  },

  /* ── HP Inkjet 963XL ────────────────────────────────────────────────────── */
  'HP Inkjet 963XL BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['HP OfficeJet Pro 9010', '9012', '9013', '9014', '9015', '9016', '9018', '9019', '9020', '9022', '9025', '9026', '9028'],
  },
  'HP Inkjet 963XL CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['HP OfficeJet Pro 9010', '9012', '9015', '9016', '9019', '9020', '9022', '9025', '9026'],
  },
  'HP Inkjet 963XL YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['HP OfficeJet Pro 9010', '9012', '9015', '9016', '9019', '9020', '9022', '9025', '9026'],
  },
  'HP Inkjet 963XL MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['HP OfficeJet Pro 9010', '9012', '9015', '9016', '9019', '9020', '9022', '9025', '9026'],
  },

  /* ── HP Inkjet 937XL ────────────────────────────────────────────────────── */
  'HP Inkjet 937XL BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['HP OfficeJet Pro 9730e', '9720e', '9718e', '9710e', '9720', '9730'],
  },
  'HP Inkjet 937XL YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['HP OfficeJet Pro 9730e', '9720e', '9718e', '9710e', '9720', '9730'],
  },
  'HP Inkjet 937XL CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['HP OfficeJet Pro 9730e', '9720e', '9718e', '9710e', '9720', '9730'],
  },
  'HP Inkjet 937XL MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['HP OfficeJet Pro 9730e', '9720e', '9718e', '9710e', '9720', '9730'],
  },

  /* ── Epson 103 ──────────────────────────────────────────────────────────── */
  'Epson 103 BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['Epson EcoTank L1110', 'L3100', 'L3101', 'L3110', 'L3150', 'L3151', 'L3156', 'L3160', 'L5190', 'L5196'],
  },
  'Epson 103 CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['Epson EcoTank L3100', 'L3110', 'L3150', 'L3151', 'L3156', 'L3160', 'L5190', 'L5196'],
  },
  'Epson 103 MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['Epson EcoTank L3100', 'L3110', 'L3150', 'L3151', 'L3156', 'L3160', 'L5190', 'L5196'],
  },
  'Epson 103 YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['Epson EcoTank L3100', 'L3110', 'L3150', 'L3151', 'L3156', 'L3160', 'L5190', 'L5196'],
  },

  /* ── Epson T789X XXL ────────────────────────────────────────────────────── */
  'Epson T7891 XXL BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['Epson WorkForce Pro WF-5110DW', 'WF-5190DW', 'WF-5620DWF', 'WF-5690DWF'],
  },
  'Epson T7892 XXL CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['Epson WorkForce Pro WF-5110DW', 'WF-5190DW', 'WF-5620DWF', 'WF-5690DWF'],
  },
  'Epson T7893 XXL MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['Epson WorkForce Pro WF-5110DW', 'WF-5190DW', 'WF-5620DWF', 'WF-5690DWF'],
  },
  'Epson T7894 XXL YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['Epson WorkForce Pro WF-5110DW', 'WF-5190DW', 'WF-5620DWF', 'WF-5690DWF'],
  },

  /* ── Pantum ─────────────────────────────────────────────────────────────── */
  'Pantum DL-410 12K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Pantum M7100DN', 'M7100DW', 'M7200FDN', 'M7200FDW', 'M7300FDN', 'M7300FDW', 'P3012DW', 'P3302DW'],
  },

  /* ── Kyocera ────────────────────────────────────────────────────────────── */
  'Kyocera TK-6307 35K': {
    kind: 'تونر ليزر', colorLabel: 'أسود فقط',
    printers: ['Kyocera TASKalfa 3500i', 'TASKalfa 4500i', 'TASKalfa 5500i'],
  },

  /* ── HP GT Series ───────────────────────────────────────────────────────── */
  'HP GT53XL BLK': {
    kind: 'حبر نافث', colorLabel: 'أسود',
    printers: ['HP DeskJet GT 5810', 'GT 5820', 'GT 5811', 'GT 5821', 'Smart Tank 310', '315', '319', '410', '415', '419'],
  },
  'HP GT52 CY': {
    kind: 'حبر نافث', colorLabel: 'سيان',
    printers: ['HP DeskJet GT 5810', 'GT 5820', 'Smart Tank 310', '315', '319', '410', '415', '419'],
  },
  'HP GT52 YL': {
    kind: 'حبر نافث', colorLabel: 'أصفر',
    printers: ['HP DeskJet GT 5810', 'GT 5820', 'Smart Tank 310', '315', '319', '410', '415', '419'],
  },
  'HP GT52 MG': {
    kind: 'حبر نافث', colorLabel: 'فوشيا',
    printers: ['HP DeskJet GT 5810', 'GT 5820', 'Smart Tank 310', '315', '319', '410', '415', '419'],
  },

  /* ── HP Inkjet 712XL ────────────────────────────────────────────────────── */
  'HP Inkjet 712XL BLK': {
    kind: 'حبر نافث (DesignJet)', colorLabel: 'أسود',
    printers: ['HP DesignJet T210', 'T230', 'T250', 'T530', 'T630', 'T650', 'Studio', 'Studio 24"', 'Studio 36"'],
  },
  'HP Inkjet 712XL CY': {
    kind: 'حبر نافث (DesignJet)', colorLabel: 'سيان',
    printers: ['HP DesignJet T210', 'T230', 'T250', 'T530', 'T630', 'T650', 'Studio'],
  },
  'HP Inkjet 712XL YL': {
    kind: 'حبر نافث (DesignJet)', colorLabel: 'أصفر',
    printers: ['HP DesignJet T210', 'T230', 'T250', 'T530', 'T630', 'T650', 'Studio'],
  },
  'HP Inkjet 712XL MG': {
    kind: 'حبر نافث (DesignJet)', colorLabel: 'فوشيا',
    printers: ['HP DesignJet T210', 'T230', 'T250', 'T530', 'T630', 'T650', 'Studio'],
  },

  /* ── HP Multipack Inkjet ────────────────────────────────────────────────── */
  'HP 305 BLK and Color': {
    kind: 'حبر نافث', colorLabel: 'أسود وملوّن',
    printers: ['HP DeskJet 2710', '2720', '2721', '2722', '2723', '2724', '2725', '2727', 'DeskJet Plus 4110', '4120', '4122', '4125', '4130', '4132', '4135'],
  },
  'HP 123 BLK and Color': {
    kind: 'حبر نافث', colorLabel: 'أسود وملوّن',
    printers: ['HP DeskJet 2130', '2132', '2134', '2136', 'Ink Advantage 3630', '3632', '3634', '3636', '3638'],
  },
  'HP 122 BLK and Color': {
    kind: 'حبر نافث', colorLabel: 'أسود وملوّن',
    printers: ['HP DeskJet 1000', '1050', '1051', '1055', '2000', '2050', '2050A', '3000', '3050', '3050A', 'D1660', 'D2660'],
  },
  'HP 650 BLK and Color': {
    kind: 'حبر نافث', colorLabel: 'أسود وملوّن',
    printers: ['HP DeskJet 1015', '1515', '2515', '2545', '2645', '3515', '3545', 'Ink Advantage 2515', '2545', '4515', '4645'],
  },
  'HP 652 BLK and Color': {
    kind: 'حبر نافث', colorLabel: 'أسود وملوّن',
    printers: ['HP DeskJet Ink Advantage 1115', '2135', '2136', '3635', '3636', '3835', '4535', '4536', '4675', '5075'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Build description + specs strings in Arabic
// ─────────────────────────────────────────────────────────────────────────────
function buildDescription(model, compatBrand, data) {
  const p = data.printers.join('، ');
  return (
    `${data.kind} BEC أصلي متوافق مع طابعات ${compatBrand.toUpperCase()}.\n\n` +
    `اللون: ${data.colorLabel}\n\n` +
    `الطابعات المتوافقة:\n${data.printers.map(pr => `• ${pr}`).join('\n')}`
  );
}

function buildSpecs(model, compatBrand, price, data) {
  return [
    `الموديل: ${model}`,
    `العلامة التجارية: BEC`,
    `متوافق مع: ${compatBrand.toUpperCase()}`,
    `اللون: ${data.colorLabel}`,
    `النوع: ${data.kind}`,
    `السعر: ${price} ₪`,
    `الطابعات المتوافقة: ${data.printers.join('، ')}`,
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const allProducts = await prisma.product.findMany({
    where: { brand: 'BEC', type: 'Ink' },
    include: { variants: true },
  });

  console.log(`Found ${allProducts.length} BEC ink products in DB.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of allProducts) {
    const model = product.modelNumber;
    const data  = COMPAT[model];

    if (!data) {
      console.warn(`  ⚠ No compat data for: "${model}"`);
      skipped++;
      continue;
    }

    // Use the compatBrand stored in the first variant's brand field
    const compatBrand = product.variants?.[0]?.brand || 'HP';
    const price       = product.variants?.[0]?.price ?? 0;

    const newDesc  = buildDescription(model, compatBrand, data);
    const newSpecs = buildSpecs(model, compatBrand, price, data);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        description: newDesc,
        variants: {
          update: product.variants.map(v => ({
            where: { id: v.id },
            data:  { specifications: newSpecs },
          })),
        },
      },
    });

    updated++;
    process.stdout.write(`\r✔ Updated ${updated}/${allProducts.length - skipped}: ${model.slice(0, 55)}`);
  }

  console.log(`\n\n✅ Done! Updated: ${updated} | Skipped (no data): ${skipped}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
