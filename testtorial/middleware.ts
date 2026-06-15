// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// دالة بسيطة للتحقق من التوكن (بدون استيراد معقد)
function simpleVerifyToken(token: string) {
  try {
    // فقط نتحقق من وجود التوكن وليس صلاحيته للتجربة
    return token && token.length > 10;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // حماية صفحات Admin (ما عدا صفحة تسجيل الدخول)
  if (pathname.startsWith('/admin')) {
    // استثناء صفحة تسجيل الدخول
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token || !simpleVerifyToken(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}