import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from './lib/userSession';
import { cookies } from 'next/headers';

// Les pages qui sont accesibles sans connexion
const publicPages = [
    '/login',
    '/register',
    '/api',
    '/'
];


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // on vérifie si c'est une page publique
    if (publicPages.some(page => pathname === page || pathname.startsWith(page + '/'))) {
        // si on accede à /login ou /register 
        if ((pathname === '/login' || pathname === '/register')) {
            const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
            // dans le cas ou on est déjà connecté
            if (session.user?.isLoggedIn) {
                return NextResponse.redirect(new URL('/groups', request.url));
            }
        }
        return NextResponse.next();
    }

    // si la page est protégée
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.user?.isLoggedIn) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
// on gère le cas des images et des fichiers statiques
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};