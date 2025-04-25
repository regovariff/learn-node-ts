import multer from 'multer';

// Store files in memory (buffer) instead of saving to disk
export const upload = multer({ storage: multer.memoryStorage() });
