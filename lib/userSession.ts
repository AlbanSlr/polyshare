import { cookies } from 'next/headers';
import { getIronSession, SessionOptions } from 'iron-session';


// définition de l'interface de l'utilisateur de la session
export interface SessionUser {
    id: number;
    username: string;
    email: string;
    isLoggedIn: boolean;
};

// définition de l'interface de la session
export interface SessionData {
    user?: SessionUser;

}

// définition des options de la session
export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
    cookieName: 'polyshare-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // une semaine de validité
    },
};

// fonction pour récupérer la session
export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    // on verifie si l'utilisateur est connecté
    if (!session.user) {
        session.user = {
            id: 0,
            username: '',
            email: '',
            isLoggedIn: false,
        };
    }
    return session;
}

// fonction pour récupérer l'utilisateur de la session
export async function getUser() {
    const session = await getSession();
    return session.user;
}