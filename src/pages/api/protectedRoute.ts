import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../middleware/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    authenticate(req, res, () => {
        // Your protected route logic here
        res.status(200).json({ message: 'This is a protected route' });
    });
}