// app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  
  try {
    if (action === 'getProducts') {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(products);
    }
    
    if (action === 'getProduct') {
      const id = parseInt(searchParams.get('id')!);
      const product = await prisma.product.findUnique({ where: { id } });
      return NextResponse.json(product);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;
    
    if (action === 'createProduct') {
      const { name, category, description, specifications, price, image } = body;
      const product = await prisma.product.create({
        data: { 
          name, 
          category, 
          description, 
          specifications, 
          price: price ? parseInt(price) : null,
          image 
        },
      });
      return NextResponse.json(product, { status: 201 });
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;
    const searchParams = request.nextUrl.searchParams;
    
    if (action === 'updateProduct') {
      const id = parseInt(searchParams.get('id')!);
      const { name, category, description, specifications, price, image } = body;
      const product = await prisma.product.update({
        where: { id },
        data: { 
          name, 
          category, 
          description, 
          specifications, 
          price: price ? parseInt(price) : null,
          image 
        },
      });
      return NextResponse.json(product);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    if (action === 'deleteProduct') {
      const id = parseInt(searchParams.get('id')!);
      await prisma.product.delete({ where: { id } });
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