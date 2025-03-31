"use server";

import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '@/lib/userSession';
import { cookies } from 'next/headers';

// Fonction pour vérifier si l'utilisateur est connecté, retourne l'utilisateur s'il est connecté
export async function authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    return user;
}

// Fonction pour gérer la connexion de l'utilisateur
export async function login(email: string, password: string) {
    const user = await authenticateUser(email, password);
    if (!user) {
        return { success: false, error: 'mail ou mot de passe invalide' };
    }
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.user = { isLoggedIn: true, id: user.id, username: user.name, email: user.email };
    await session.save();
    return { success: true };
}