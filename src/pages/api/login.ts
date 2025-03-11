import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!SECRET_KEY) {
                res.status(500).json({ error: 'Secret key not defined' });
                return;
            }
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}