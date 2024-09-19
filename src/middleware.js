import { NextResponse } from 'next/server'

function decodeRole(encodedRole) {
  return Buffer.from(encodedRole, 'base64').toString('ascii');
}

export async function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login';
  const token = request.cookies.get("token")?.value || '';
  const encodedRole = request.cookies.get("role")?.value || '';
  if (isPublicPath && token) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@hii public + token')
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!isPublicPath && !token) {
    console.log('hii without')
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (encodedRole) {
    const role = decodeRole(encodedRole); // Decode the role
    console.log("User role:", role);

    // Check access based on role
    if (path === '/employee' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/product', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
  // matcher: ['/login', '/employee', '/cart'],
}