import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/* Global singleton — avoids exhausting DB connections in serverless */
const globalForPrisma = global as unknown as { _cms_prisma?: PrismaClient };
const prisma = globalForPrisma._cms_prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma._cms_prisma = prisma;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return Boolean(token && token.length > 10);
}

/* ── GET ──────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');

  if (action === 'checkAuth') {
    return NextResponse.json({ isAdmin: isAdmin(req) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  if (action === 'getBlocks') {
    const page = req.nextUrl.searchParams.get('page') || 'home';
    try {
      const rows = await prisma.contentBlock.findMany({ where: { pageSlug: page } });
      const map: Record<string, string> = {};
      for (const r of rows) map[r.blockKey] = r.value;
      return NextResponse.json(map, { headers: { 'Cache-Control': 'no-store' } });
    } catch (e) {
      console.error('[CMS getBlocks]', e);
      return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

/* ── PUT ──────────────────────────────────────────────────── */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { pageSlug?: string; blockKey?: string; blockType?: string; value?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pageSlug = 'home', blockKey, blockType = 'text', value = '' } = body;
  if (!blockKey) {
    return NextResponse.json({ error: 'blockKey required' }, { status: 400 });
  }

  try {
    const block = await prisma.contentBlock.upsert({
      where:  { pageSlug_blockKey: { pageSlug, blockKey } },
      create: { pageSlug, blockKey, blockType, value: String(value) },
      update: { value: String(value), blockType },
    });
    return NextResponse.json(block);
  } catch (e) {
    console.error('[CMS PUT] Prisma error:', e);
    const msg = e instanceof Error ? e.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* ── DELETE ───────────────────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { pageSlug?: string; blockKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pageSlug = 'home', blockKey } = body;
  if (!blockKey) {
    return NextResponse.json({ error: 'blockKey required' }, { status: 400 });
  }

  try {
    await prisma.contentBlock.deleteMany({ where: { pageSlug, blockKey } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[CMS DELETE] Prisma error:', e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
