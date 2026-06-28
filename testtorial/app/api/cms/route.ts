import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return Boolean(token && token.length > 10);
}

/* ── GET /api/cms ───────────────────────────────────────────
   ?action=checkAuth          → { isAdmin: boolean }
   ?action=getBlocks&page=home → Record<blockKey, value>
─────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const action = p.get('action');

  if (action === 'checkAuth') {
    return NextResponse.json({ isAdmin: isAdmin(req) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  if (action === 'getBlocks') {
    const page = p.get('page') || 'home';
    const rows = await prisma.contentBlock.findMany({ where: { pageSlug: page } });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.blockKey] = r.value;
    return NextResponse.json(map, { headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

/* ── PUT /api/cms ───────────────────────────────────────────
   Body: { pageSlug?, blockKey, blockType?, value }
   → upserts the ContentBlock row
─────────────────────────────────────────────────────────── */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { pageSlug?: string; blockKey?: string; blockType?: string; value?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pageSlug = 'home', blockKey, blockType = 'text', value = '' } = body;
  if (!blockKey) return NextResponse.json({ error: 'blockKey required' }, { status: 400 });

  const block = await prisma.contentBlock.upsert({
    where: { pageSlug_blockKey: { pageSlug, blockKey } },
    create: { pageSlug, blockKey, blockType, value: String(value) },
    update: { value: String(value), blockType },
  });

  return NextResponse.json(block);
}

/* ── DELETE /api/cms ─────────────────────────────────────────
   Body: { pageSlug?, blockKey }
   → resets a block to default (removes from DB)
─────────────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { pageSlug?: string; blockKey?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pageSlug = 'home', blockKey } = body;
  if (!blockKey) return NextResponse.json({ error: 'blockKey required' }, { status: 400 });

  await prisma.contentBlock.deleteMany({ where: { pageSlug, blockKey } });
  return NextResponse.json({ ok: true });
}
