"use server";

import {prisma} from '@/lib/db';
import { getSession } from '@/lib/session';
import bcrypt from 'bcrypt';

export async function login(email : string, password : string) {
    const user = await prisma.user.findUnique({
        where: {email},
    });
    if (!user){
        return {success:false, error: 'Email invalide'};
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return {success: false, error: 'Mot de passe invalide'};
    }
    const session = await getSession();
    session.user = {
        id: user.id,
        username: user.name,
        email: user.email,
    };
    await session.save();
    return {success: true};
}