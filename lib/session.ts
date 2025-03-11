import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

type Session = {
    user: {
        id: number;
        username: string;
        email: string;
    };
    };

export async function getSession() {
  const session = await getIronSession<Session>(await cookies(), { password: process.env.SESSION_SECRET!, cookieName: "session" });
  return session
}