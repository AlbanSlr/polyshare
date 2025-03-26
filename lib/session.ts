import { cookies } from 'next/headers';
import { getIronSession, SessionOptions } from 'iron-session';



// on definie le type de session utilisateur
export interface SessionUser {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
};

// on definie les données de session
export interface SessionData {
  user?: SessionUser;

}

// on definit les options de session
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'polyshare-session',
  cookieOptions: {
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession(){
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  // si la session n'existe pas on la crée (vide)
  if (!session.user) {
    session.user = {
      id: '',
      username: '',
      email: '',
      isLoggedIn: false,
    };
  }

  return session;
}