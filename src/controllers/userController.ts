import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userService from '../services/userService';
import cloudinary from '../lib/cloudinary';
import streamifier from 'streamifier';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const existing = await userService.findUserByUsername(username);
        if (existing) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.createUser(username, hashedPassword);

        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await userService.findUserByUsername(username);
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Check for existing active token
        if (user.current_token) {
            res.status(403).json({
                message: 'You are already logged in on another device. Please logout first.',
            });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '4h',
        });

        await userService.updateCurrentToken(user.id, token);

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// logout if 2 devices
// profile pic in db
// status (like linkedin)

export const profile = async (req: Request, res: Response) => {
    const decoded = req.user;

    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
    }

    try {
        const user = await userService.findUserById(Number(decoded.id));
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { current_token, ...safeUser } = user;
        res.json({ message: 'Profile fetched', user: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const decoded = req.user;

        if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
            res.status(401).json({ message: 'Invalid token payload' });
            return;
        }

        const { email, fullname, bio, skills, password } = req.body;

        let parsedSkills: string[] | undefined;
        if (skills) {
            try {
                parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
                if (!Array.isArray(parsedSkills)) throw new Error();
            } catch {
                res.status(400).json({ message: 'Invalid skills format. Must be a JSON array.' });
                return;
            }
        }

        // Handle image upload to Cloudinary
        let profile_picture: string | undefined;
        if (req.file) {
            profile_picture = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'profile_pictures',
                        public_id: `user_${decoded.id}`,
                        overwrite: true,
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error || !result) {
                            console.error('Cloudinary upload error:', error);
                            return reject(error || new Error('Cloudinary upload failed'));
                        }
                        resolve(result.secure_url);
                    },
                );

                if (req.file) {
                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
                }
            });
        }

        // Update user profile
        const updatedUser = await userService.updateUserProfile(decoded.id, {
            email,
            fullname,
            bio,
            skills: parsedSkills,
            password,
            profile_picture,
        });

        const { current_token, ...safeUser } = updatedUser;
        res.json({ message: 'Profile updated', user: safeUser });
    } catch (err: any) {
        console.error('Update failed:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * LOGOUT
 */
export const logout = async (req: Request, res: Response) => {
    const decoded = req.user;
    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
    }

    try {
        await userService.clearCurrentToken(decoded.id);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};