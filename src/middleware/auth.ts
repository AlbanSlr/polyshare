import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY = process.env.SECRET_KEY as string;

export function authenticate(req: NextApiRequest, res: NextApiResponse, next: Function) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = (decoded as any).userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}