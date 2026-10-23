import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CropShield AI / GramSathi — Next.js 16 proxy convention
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
