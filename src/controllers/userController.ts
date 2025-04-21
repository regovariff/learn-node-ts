import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // create access token
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '4h',
        });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const profile = async (req: Request, res: Response) => {
    const decoded = req.user;

    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
    }

    try {
        // exclude password
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            message: 'Profile fetched',
            user,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    const { username } = req.params;
    console.log('Headers:', req);

    try {
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ message: 'User profile', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.json({ message: 'Token revoked (handled on client)' });
};
