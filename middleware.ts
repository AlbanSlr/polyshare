import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from './lib/session';

// Pages publiques qui ne nécessitent pas d'authentification
const publicPages = ['/login', '/register', '/api','/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser l'accès aux pages publiques
  if (publicPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.next();
  }

  // Vérifier la session utilisateur
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.user?.isLoggedIn) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Ajouter un paramètre pour rediriger après connexion
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // Appliquer le middleware à toutes les pages sauf les fichiers statiques
};