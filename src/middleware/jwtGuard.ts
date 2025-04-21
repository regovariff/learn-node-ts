import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
    export interface Request {
        user?: JwtPayload | string;
    }
}

export const jwtGuard = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers['authorization'];

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    const token = header.split(' ')[1];
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        console.error('ACCESS_TOKEN_SECRET is not set');
        res.status(500).json({ message: 'Server error: Missing secret key' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        // Attach decoded token payload
        req.user = decoded;
        console.log('JWT verified:', decoded);
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return;
    }
};
