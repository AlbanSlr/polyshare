"use server";

import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

// fonction pour enregistrer un nouvel utilisateur
export async function register(username: string, email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (user) {
        return { success: false, error: 'Email déjà utilisé' };
    }
    if (password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            },
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Une erreur est survenue' };
    }
}