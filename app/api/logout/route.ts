import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  
  // Réinitialiser le user complètement
  session.user = {
    id: '',
    username: '',
    email: '',
    isLoggedIn: false,
  };
  
  await session.save();
  
  // Rediriger avec un timestamp pour éviter la mise en cache
  return NextResponse.redirect(new URL(`/?t=${Date.now()}`, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}