import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    
    if (session.user?.isLoggedIn) {
      return NextResponse.json({ user: session.user });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Error fetching user session:', error);
    return NextResponse.json(
      { error: 'Internal server error', user: null },
      { status: 500 }
    );
  }
}