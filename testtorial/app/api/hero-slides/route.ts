import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const g = global as unknown as { _hs_prisma?: PrismaClient };
const prisma = g._hs_prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') g._hs_prisma = prisma;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  const t = req.cookies.get('admin_token')?.value;
  return Boolean(t && t.length > 10);
}

/* ── GET — public, returns active slides sorted by sortOrder ── */
export async function GET(req: NextRequest) {
  const adminOnly = req.nextUrl.searchParams.get('all') === '1';
  try {
    const slides = await prisma.heroSlide.findMany({
      where: adminOnly ? {} : { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(slides, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[hero-slides GET]', e);
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}

/* ── POST — create ──────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    /* auto-assign sortOrder as max+1 */
    const max = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } });
    const slide = await prisma.heroSlide.create({
      data: {
        badge:     body.badge     ?? '',
        h1:        body.h1        ?? '',
        h1Grad:    body.h1Grad    ?? '',
        h1Sub:     body.h1Sub     ?? '',
        desc:      body.desc      ?? '',
        cta1Label: body.cta1Label ?? '',
        cta1Href:  body.cta1Href  ?? '',
        cta2Label: body.cta2Label ?? '',
        cta2Href:  body.cta2Href  ?? '',
        imageSrc:  body.imageSrc  ?? '',
        imgScale:  body.imgScale  ?? 1.05,
        active:    body.active    ?? true,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });
    return NextResponse.json(slide, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* ── PUT — update ───────────────────────────────────────────── */
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const slide = await prisma.heroSlide.update({ where: { id: Number(id) }, data });
    return NextResponse.json(slide);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* ── DELETE ─────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.heroSlide.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
