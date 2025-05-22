import { NextRequest, NextResponse } from 'next/server';

// For static exports, we need to disable the API route
export const dynamic = 'force-static';

// Return a static response for the search API
export async function GET() {
  return NextResponse.json(
    { message: 'Search is handled client-side for static exports' },
    { status: 200 }
  );
}
