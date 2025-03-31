import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/userSession';

//Fonction pour récupérer un utilisateur
export async function GET() {

    //On récupère la session avec un cookie 
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (session.user) {
        return NextResponse.json(session.user);
    } else {
        return NextResponse.json({
            id: 0,
            username: '',
            email: '',
            isLoggedIn: false,
        });
    }
}