// app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============ GET ============
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    if (action === 'getCategoryById') {
      const id = parseInt(searchParams.get('id') || '0');
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const rows = await prisma.$queryRaw<{ id: number; title: string; link: string; variantIds: string }[]>`
        SELECT id, title, link, "variantIds" FROM "HomepageCategory" WHERE id = ${id}
      `;
      if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const cat = rows[0];
      const variantIds: number[] = (() => { try { return JSON.parse(cat.variantIds || '[]'); } catch { return []; } })();
      return NextResponse.json({ ...cat, variantIds });
    }

    if (action === 'getProducts') {
      const type = searchParams.get('type');
      const admin = searchParams.get('admin') === '1';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = type ? { type } : undefined;

      // ── Run all 3 DB queries in parallel ──────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [products, hiddenP, variantExtras] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { variants: true },
          orderBy: { createdAt: 'desc' },
        }) as Promise<any[]>,
        prisma.$queryRaw<{id:number}[]>`SELECT id FROM "Product" WHERE hidden = true`,
        prisma.$queryRaw<{id:number; hidden:boolean; gallery:string}[]>`SELECT id, hidden, gallery FROM "Variant"`,
      ]);

      const hiddenPSet = new Set(hiddenP.map(r => r.id));
      const variantExtraMap = new Map(variantExtras.map(r => [r.id, r]));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const withExtras = products.map((p: any) => ({
        ...p,
        hidden: hiddenPSet.has(p.id),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variants: p.variants.map((v: any) => {
          const extra = variantExtraMap.get(v.id);
          let gallery: string[] = [];
          try { gallery = JSON.parse(extra?.gallery || '[]'); } catch { gallery = []; }
          return { ...v, hidden: extra?.hidden ?? false, gallery };
        }),
      }));

      const CC = { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=90' };
      if (admin) return NextResponse.json(withExtras, { headers: { 'Cache-Control': 'no-store' } });
      const result = withExtras
        .filter((p: any) => !p.hidden)
        .map((p: any) => ({ ...p, variants: p.variants.filter((v: any) => !v.hidden) }));
      return NextResponse.json(result, { headers: CC });
    }

    if (action === 'getHomepageData') {
      const [settings, banners, rawCategories] = await Promise.all([
        prisma.$queryRaw<{ key: string; value: string }[]>`SELECT key, value FROM "HomepageSettings"`,
        prisma.$queryRaw<{ id: number; title: string; subtitle: string; ctaText: string; ctaLink: string; bgColor: string; image: string; active: boolean; sortOrder: number }[]>`
          SELECT * FROM "HomepageBanner" WHERE active = true ORDER BY "sortOrder"`,
        prisma.$queryRaw<{ id: number; title: string; description: string; image: string; link: string; icon: string; active: boolean; sortOrder: number; variantIds: string; displayMode: string }[]>`
          SELECT * FROM "HomepageCategory" WHERE active = true ORDER BY "sortOrder"`,
      ]);
      const settingsMap: Record<string, string> = {};
      for (const s of settings) settingsMap[s.key] = s.value;
      // Only resolve variants for categories in 'products' mode
      const allVariantIds = new Set<number>();
      const catVariantIds: Record<number, number[]> = {};
      for (const cat of rawCategories) {
        try { catVariantIds[cat.id] = JSON.parse(cat.variantIds || '[]'); } catch { catVariantIds[cat.id] = []; }
        if ((cat.displayMode || 'products') === 'products') {
          for (const vid of catVariantIds[cat.id]) allVariantIds.add(vid);
        }
      }
      let variantMap: Record<number, { id: number; name: string; image: string }> = {};
      if (allVariantIds.size > 0) {
        const ids = [...allVariantIds];
        const variants = await prisma.variant.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true, image: true },
        });
        for (const v of variants) variantMap[v.id] = v;
      }
      const categories = rawCategories.map(cat => ({
        ...cat,
        displayMode: cat.displayMode || 'products',
        variantIds: catVariantIds[cat.id],
        variants: (cat.displayMode || 'products') === 'products'
          ? catVariantIds[cat.id].map(id => variantMap[id]).filter(Boolean)
          : [],
      }));
      return NextResponse.json({ settings: settingsMap, banners, categories }, { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=90' } });
    }

    if (action === 'getHomepageAdmin') {
      const [settings, banners, categories] = await Promise.all([
        prisma.$queryRaw<{ key: string; value: string }[]>`SELECT key, value FROM "HomepageSettings"`,
        prisma.$queryRaw<{ id: number; title: string; subtitle: string; ctaText: string; ctaLink: string; bgColor: string; image: string; active: boolean; sortOrder: number }[]>`
          SELECT * FROM "HomepageBanner" ORDER BY "sortOrder"`,
        prisma.$queryRaw<{ id: number; title: string; description: string; image: string; link: string; icon: string; active: boolean; sortOrder: number; variantIds: string; displayMode: string }[]>`
          SELECT * FROM "HomepageCategory" ORDER BY "sortOrder"`,
      ]);
      const settingsMap: Record<string, string> = {};
      for (const s of settings) settingsMap[s.key] = s.value;
      const categoriesWithIds = categories.map(c => ({
        ...c,
        displayMode: c.displayMode || 'products',
        variantIds: (() => { try { return JSON.parse(c.variantIds || '[]'); } catch { return []; } })(),
      }));
      return NextResponse.json({ settings: settingsMap, banners, categories: categoriesWithIds });
    }

    if (action === 'getFeaturedInkProducts') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [products, hiddenP, hiddenV] = await Promise.all([
        prisma.product.findMany({
          where: { type: 'Ink', featured: true },
          include: { variants: true },
          orderBy: { createdAt: 'desc' },
        }) as Promise<any[]>,
        prisma.$queryRaw<{id:number}[]>`SELECT id FROM "Product" WHERE hidden = true`,
        prisma.$queryRaw<{id:number}[]>`SELECT id FROM "Variant" WHERE hidden = true`,
      ]);
      const hiddenPSet = new Set(hiddenP.map(r => r.id));
      const hiddenVSet = new Set(hiddenV.map(r => r.id));
      const result = products
        .filter(p => !hiddenPSet.has(p.id))
        .map(p => ({ ...p, variants: p.variants.filter((v: any) => !hiddenVSet.has(v.id)) }));
      return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } });
    }

    if (action === 'getProduct') {
      const id = parseInt(searchParams.get('id')!);
      const admin = searchParams.get('admin') === '1';

      const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true },
      });
      if (!product) return NextResponse.json(null);

      const variantIds = product.variants.map((v: { id: number }) => v.id);

      // ── Run attrs + hidden-filter + gallery in parallel ────────────
      const [attrs, hiddenVRows, galleryRows] = await Promise.all([
        variantIds.length > 0
          ? prisma.$queryRaw<{ id: number; variantId: number; name: string; order: number; options: unknown[] }[]>`
              SELECT pa.id, pa."variantId", pa.name, pa."order",
                COALESCE(
                  json_agg(
                    json_build_object('id',ao.id,'attributeId',ao."attributeId",'value',ao.value,'image',ao.image,'price',ao."price",'order',ao."order")
                    ORDER BY ao."order"
                  ) FILTER (WHERE ao.id IS NOT NULL), '[]'
                ) as options
              FROM "ProductAttribute" pa
              LEFT JOIN "AttributeOption" ao ON ao."attributeId" = pa.id
              WHERE pa."variantId" = ANY(${variantIds}::int[])
              GROUP BY pa.id ORDER BY pa."order"
            `
          : Promise.resolve([]),
        !admin
          ? prisma.$queryRaw<{id:number}[]>`SELECT id FROM "Variant" WHERE hidden = true`
          : Promise.resolve([]),
        variantIds.length > 0
          ? prisma.$queryRaw<{id:number; gallery:string}[]>`SELECT id, gallery FROM "Variant" WHERE id = ANY(${variantIds}::int[])`
          : Promise.resolve([]),
      ]);

      const attrMap: Record<number, unknown[]> = {};
      for (const a of attrs as { id: number; variantId: number; name: string; order: number; options: unknown[] }[]) {
        if (!attrMap[a.variantId]) attrMap[a.variantId] = [];
        attrMap[a.variantId].push(a);
      }

      const hiddenVSet = new Set((hiddenVRows as {id:number}[]).map(r => r.id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visibleVariants = admin ? product.variants : (product.variants as any[]).filter(v => !hiddenVSet.has(v.id));

      const galleryMap: Record<number, string[]> = {};
      for (const r of galleryRows as {id:number; gallery:string}[]) {
        try { galleryMap[r.id] = JSON.parse(r.gallery || '[]'); } catch { galleryMap[r.id] = []; }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enriched = { ...product, variants: visibleVariants.map((v: any) => ({ ...v, gallery: galleryMap[v.id] || [], attributes: attrMap[v.id] || [] })) };
      const cc = admin ? { 'Cache-Control': 'no-store' } : { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' };
      return NextResponse.json(enriched, { headers: cc });
    }

    if (action === 'getAttributes') {
      const variantId = parseInt(searchParams.get('variantId')!);
      const attrs = await prisma.$queryRaw<{ id: number; variantId: number; name: string; order: number; options: unknown[] }[]>`
        SELECT pa.id, pa."variantId", pa.name, pa."order",
          COALESCE(
            json_agg(
              json_build_object('id',ao.id,'attributeId',ao."attributeId",'value',ao.value,'image',ao.image,'price',ao."price",'order',ao."order")
              ORDER BY ao."order"
            ) FILTER (WHERE ao.id IS NOT NULL), '[]'
          ) as options
        FROM "ProductAttribute" pa
        LEFT JOIN "AttributeOption" ao ON ao."attributeId" = pa.id
        WHERE pa."variantId" = ${variantId}
        GROUP BY pa.id ORDER BY pa."order"
      `;
      return NextResponse.json(attrs);
    }

    if (action === 'getVariants') {
      const productId = parseInt(searchParams.get('productId')!);
      const variants = await prisma.variant.findMany({
        where: { productId },
      });
      return NextResponse.json(variants);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============ POST ============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'createProduct') {
      const { name, category, description, image, type, brand, modelNumber, colorType, featured, variants } = body;
      const product = await prisma.product.create({
        data: {
          name,
          category,
          description,
          image: image || '',
          type: type || 'Device',
          brand: brand || '',
          modelNumber: modelNumber || '',
          colorType: colorType || '',
          featured: featured === true,
          variants: { create: variants || [] },
        },
        include: { variants: true },
      });
      return NextResponse.json(product, { status: 201 });
    }

    if (action === 'addVariant') {
      const { productId, name, brand, price, specifications, image, stock, colorType } = body;
      const variant = await prisma.variant.create({
        data: {
          productId: parseInt(productId),
          name,
          brand: brand || '',
          price: parseInt(price),
          specifications: specifications || '',
          image: image || '',
          stock: stock ? parseInt(stock) : null,
          colorType: colorType || '',
        },
      });
      return NextResponse.json(variant, { status: 201 });
    }

    if (action === 'createAttribute') {
      const vid = parseInt(body.variantId);
      const attrName = body.name as string;
      const result = await prisma.$queryRaw<{ id: number; variantId: number; name: string; order: number }[]>`
        INSERT INTO "ProductAttribute" ("variantId", name, "order", "createdAt")
        VALUES (${vid}, ${attrName}, (SELECT COUNT(*)::int FROM "ProductAttribute" WHERE "variantId"=${vid}), NOW())
        RETURNING id, "variantId", name, "order"
      `;
      return NextResponse.json({ ...result[0], options: [] }, { status: 201 });
    }

    if (action === 'createAttributeOption') {
      const aid = parseInt(body.attributeId);
      const val = body.value as string;
      const img = (body.image || '') as string;
      const price = body.price != null && body.price !== '' ? parseInt(body.price) : null;
      const result = await prisma.$queryRaw<{ id: number; attributeId: number; value: string; image: string; price: number | null; order: number }[]>`
        INSERT INTO "AttributeOption" ("attributeId", value, image, "price", "order", "createdAt")
        VALUES (${aid}, ${val}, ${img}, ${price}, (SELECT COUNT(*)::int FROM "AttributeOption" WHERE "attributeId"=${aid}), NOW())
        RETURNING id, "attributeId", value, image, "price", "order"
      `;
      return NextResponse.json(result[0], { status: 201 });
    }

    if (action === 'consolidateInkProducts') {
      const parentName = body.parentName || 'حبر BEC';
      let parent = await prisma.product.findFirst({ where: { type: 'Ink', name: parentName } });
      if (!parent) {
        parent = await prisma.product.create({
          data: {
            name: parentName,
            type: 'Ink',
            category: 'حبر',
            description: 'جميع أحبار وتونرات BEC',
            image: '',
            brand: 'BEC',
            modelNumber: '',
            colorType: '',
            featured: false,
          },
        });
      }

      const inkProducts = await prisma.product.findMany({
        where: { type: 'Ink', NOT: { id: parent.id } },
        include: { variants: true },
      });

      let merged = 0;
      for (const p of inkProducts) {
        try {
          if (p.variants.length > 0) {
            await prisma.variant.updateMany({
              where: { productId: p.id },
              data: { productId: parent.id, colorType: p.colorType || '' },
            });
          } else {
            await prisma.variant.create({
              data: {
                productId: parent.id,
                name: p.name,
                brand: p.brand || '',
                price: 0,
                specifications: p.description || '',
                image: p.image || '',
                colorType: p.colorType || '',
              },
            });
          }
          await prisma.product.delete({ where: { id: p.id } });
          merged++;
        } catch (e) {
          console.error(`skip product ${p.id}:`, e);
        }
      }
      return NextResponse.json({ success: true, merged });
    }

    if (action === 'saveHomepageSetting') {
      const { key, value } = body as { key: string; value: string };
      await prisma.$executeRaw`
        INSERT INTO "HomepageSettings" (key, value) VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = ${value}
      `;
      return NextResponse.json({ ok: true });
    }

    if (action === 'upsertBanner') {
      const { id, title, subtitle, ctaText, ctaLink, bgColor, image, active, sortOrder } = body;
      const _title = title || ''; const _subtitle = subtitle || ''; const _cta = ctaText || 'عرض';
      const _link = ctaLink || '/products'; const _bg = bgColor || '#2563eb';
      const _img = image || ''; const _active = active !== false; const _order = sortOrder || 0;
      if (id) {
        await prisma.$executeRaw`
          UPDATE "HomepageBanner" SET title=${_title}, subtitle=${_subtitle}, "ctaText"=${_cta}, "ctaLink"=${_link}, "bgColor"=${_bg}, image=${_img}, active=${_active}, "sortOrder"=${_order}
          WHERE id=${parseInt(id)}
        `;
      } else {
        await prisma.$executeRaw`
          INSERT INTO "HomepageBanner" (title, subtitle, "ctaText", "ctaLink", "bgColor", image, active, "sortOrder")
          VALUES (${_title}, ${_subtitle}, ${_cta}, ${_link}, ${_bg}, ${_img}, ${_active}, ${_order})
        `;
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'deleteBanner') {
      await prisma.$executeRaw`DELETE FROM "HomepageBanner" WHERE id = ${parseInt(body.id)}`;
      return NextResponse.json({ ok: true });
    }

    if (action === 'upsertCategory') {
      const { id, title, description, image, link, icon, active, sortOrder, variantIds, displayMode } = body;
      const _title = title || ''; const _desc = description || ''; const _img = image || '';
      const _link = link || '/products'; const _icon = icon || ''; const _active = active !== false; const _order = sortOrder || 0;
      const _vids = JSON.stringify(Array.isArray(variantIds) ? variantIds : []);
      const _mode = displayMode === 'logo' ? 'logo' : 'products';
      if (id) {
        await prisma.$executeRaw`
          UPDATE "HomepageCategory" SET title=${_title}, description=${_desc}, image=${_img}, link=${_link}, icon=${_icon}, active=${_active}, "sortOrder"=${_order}, "variantIds"=${_vids}, "displayMode"=${_mode}
          WHERE id=${parseInt(id)}
        `;
      } else {
        await prisma.$executeRaw`
          INSERT INTO "HomepageCategory" (title, description, image, link, icon, active, "sortOrder", "variantIds", "displayMode")
          VALUES (${_title}, ${_desc}, ${_img}, ${_link}, ${_icon}, ${_active}, ${_order}, ${_vids}, ${_mode})
        `;
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'deleteCategory') {
      await prisma.$executeRaw`DELETE FROM "HomepageCategory" WHERE id = ${parseInt(body.id)}`;
      return NextResponse.json({ ok: true });
    }

    if (action === 'login') {
      const { username, password } = body;
      if (username === 'admin' && password === 'admin123') {
        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_token', 'admin-authenticated', {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============ PUT ============
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;
    const searchParams = request.nextUrl.searchParams;

    if (action === 'toggleFeatured') {
      const id = parseInt(searchParams.get('id')!);
      const product = await prisma.product.update({
        where: { id },
        data: { featured: body.featured === true },
        include: { variants: true },
      });
      return NextResponse.json(product);
    }

    if (action === 'toggleVariantFeatured') {
      const id = parseInt(searchParams.get('id')!);
      const variant = await prisma.variant.update({
        where: { id },
        data: { featured: body.featured === true },
      });
      return NextResponse.json(variant);
    }

    if (action === 'toggleHidden') {
      const id = parseInt(searchParams.get('id')!);
      const val = body.hidden === true;
      await prisma.$executeRaw`UPDATE "Product" SET "hidden"=${val} WHERE id=${id}`;
      const product = await prisma.product.findUnique({ where: { id }, include: { variants: true } });
      return NextResponse.json(product);
    }

    if (action === 'toggleVariantHidden') {
      const id = parseInt(searchParams.get('id')!);
      const val = body.hidden === true;
      await prisma.$executeRaw`UPDATE "Variant" SET "hidden"=${val} WHERE id=${id}`;
      const variant = await prisma.variant.findUnique({ where: { id } });
      return NextResponse.json(variant);
    }

    if (action === 'updateProduct') {
      const id = parseInt(searchParams.get('id')!);
      const { name, category, description, image, type, brand, modelNumber, colorType, featured } = body;
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          category,
          description,
          image,
          type: type || 'Device',
          brand: brand || '',
          modelNumber: modelNumber || '',
          colorType: colorType || '',
          featured: featured === true,
        },
        include: { variants: true },
      });
      return NextResponse.json(product);
    }

    if (action === 'addVariant') {
      const { productId, name, brand, price, specifications, image, stock, colorType } = body;
      const variant = await prisma.variant.create({
        data: {
          productId: parseInt(productId),
          name,
          brand: brand || '',
          price: parseInt(price),
          specifications: specifications || '',
          image: image || '',
          stock: stock ? parseInt(stock) : null,
          colorType: colorType || '',
        },
      });
      return NextResponse.json(variant, { status: 201 });
    }

    if (action === 'updateVariant') {
      const id = parseInt(searchParams.get('id')!);
      const { name, brand, price, specifications, image, stock, colorType, gallery } = body;
      const galleryJson = JSON.stringify(Array.isArray(gallery) ? gallery.filter(Boolean).slice(0, 3) : []);
      const variant = await prisma.variant.update({
        where: { id },
        data: {
          name,
          brand: brand || '',
          price: parseInt(price),
          specifications: specifications || '',
          image: image || '',
          stock: stock ? parseInt(stock) : null,
          colorType: colorType || '',
        },
      });
      await prisma.$executeRaw`UPDATE "Variant" SET gallery=${galleryJson} WHERE id=${id}`;
      return NextResponse.json({ ...variant, gallery: JSON.parse(galleryJson) });
    }

    if (action === 'updateAttribute') {
      const id = parseInt(searchParams.get('id')!);
      const attrName = body.name as string;
      const result = await prisma.$queryRaw<{ id: number; variantId: number; name: string; order: number }[]>`
        UPDATE "ProductAttribute" SET name=${attrName} WHERE id=${id}
        RETURNING id, "variantId", name, "order"
      `;
      const opts = await prisma.$queryRaw<{ id: number; attributeId: number; value: string; image: string; order: number }[]>`
        SELECT id, "attributeId", value, image, "order" FROM "AttributeOption" WHERE "attributeId"=${id} ORDER BY "order"
      `;
      return NextResponse.json({ ...result[0], options: opts });
    }

    if (action === 'updateAttributeOption') {
      const id = parseInt(searchParams.get('id')!);
      const val = body.value as string;
      const img = (body.image || '') as string;
      const price = body.price != null && body.price !== '' ? parseInt(body.price) : null;
      const result = await prisma.$queryRaw<{ id: number; attributeId: number; value: string; image: string; price: number | null; order: number }[]>`
        UPDATE "AttributeOption" SET value=${val}, image=${img}, "price"=${price} WHERE id=${id}
        RETURNING id, "attributeId", value, image, "price", "order"
      `;
      return NextResponse.json(result[0]);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============ DELETE ============
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'deleteProduct') {
      const id = parseInt(searchParams.get('id')!);
      await prisma.product.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteVariant') {
      const id = parseInt(searchParams.get('id')!);
      await prisma.variant.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteAttribute') {
      const id = parseInt(searchParams.get('id')!);
      await prisma.$executeRaw`DELETE FROM "AttributeOption" WHERE "attributeId"=${id}`;
      await prisma.$executeRaw`DELETE FROM "ProductAttribute" WHERE id=${id}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteAttributeOption') {
      const id = parseInt(searchParams.get('id')!);
      await prisma.$executeRaw`DELETE FROM "AttributeOption" WHERE id=${id}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('admin_token');
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
