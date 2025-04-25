import { Request, Response } from 'express';
import * as statusService from '../services/statusService';

export const postStatus = async (req: Request, res: Response) => {
    const decoded = req.user;
    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string') {
        res.status(400).json({ message: 'Status message is required' });
        return;
    }

    try {
        const status = await statusService.createStatus(decoded.id, message);
        res.status(201).json({ message: 'Status posted', status });
    } catch (err) {
        console.error('Post status error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteStatus = async (req: Request, res: Response) => {
    const decoded = req.user;
    if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
    }

    const { statusId } = req.params;
    if (!statusId || typeof statusId !== 'string' || isNaN(Number(statusId))) {
        res.status(400).json({ message: 'Status ID is required' });
        return;
    }

    try {
        await statusService.deleteStatus(decoded.id, Number(statusId));
        res.status(204).json({ message: 'Status deleted' });
        return;
    } catch (err: any) {
        console.error('Error deleting status:', err.message || err);
        if (err.message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
        } else if (err.message === 'Status not found') {
            res.status(404).json({ message: 'Status not found' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
        return;
    }
};

export const getStatuses = async (_req: Request, res: Response) => {
    try {
        const statuses = await statusService.getAllStatuses();
        res.json({ statuses });
    } catch (err) {
        console.error('Fetch statuses error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
