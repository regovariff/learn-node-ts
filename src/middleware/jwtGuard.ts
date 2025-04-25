import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as userService from '../services/userService';

declare module 'express' {
    export interface Request {
        user?: JwtPayload | string;
    }
}

export const jwtGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        // Attach decoded token payload
        req.user = decoded;

        const user = await userService.findUserById(Number(decoded.id));
        if (!user || user.current_token !== token) {
            res.status(403).json({ message: 'Session invalid or expired. Please log in again.' });
            return;
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return;
    }
};
