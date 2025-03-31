"use server";

import { sessionOptions, SessionData } from '@/lib/userSession';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

// Fonction pour gérer la déconnexion de l'utilisateur
export async function logout() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // on supprime la session
    session.user = {
        id: 0,
        username: '',
        email: '',
        isLoggedIn: false,
    };
    await session.save();

    return { success: true };
}