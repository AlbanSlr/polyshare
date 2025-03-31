"use server";

import { getSession } from "@/lib/userSession";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

// Définition le type de retour de nos fonctions
type ProfileResult = {
    success: boolean;
    error?: string;
};

//fonction de mise à jour du username et de l'email
export async function updateProfile(username: string, email: string): Promise<ProfileResult> {
    try {
        const session = await getSession();

        if (!session.user?.isLoggedIn) {
            return { success: false, error: "Vous devez être connecté" };
        }

        const userId = session.user.id;

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== userId) {
                return { success: false, error: "Cette adresse e-mail est déjà utilisée" };
            }
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: username,
                email: email,
            },
        });

        // Mettre à jour la session
        session.user = {
            ...session.user,
            username: updatedUser.name,
            email: updatedUser.email,
        };

        await session.save();

        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la mise à jour du profil"
        };
    }
}

// Fonction de mise à jour du mot de passe
export async function updatePassword(newPassword: string): Promise<ProfileResult> {
    try {
        const session = await getSession();

        if (!session.user?.isLoggedIn) {
            return { success: false, error: "Vous devez être connecté" };
        }

        const userId = session.user.id;

        // le mot de passe doit contenir au moins 6 caractères
        if (newPassword.length < 6) {
            return {
                success: false,
                error: "Le nouveau mot de passe doit contenir au moins 6 caractères"
            };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return {
            success: false,
            error: "Une erreur est survenue lors de la mise à jour du mot de passe"
        };
    }
}