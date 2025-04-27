import { pool } from '../lib/db';

export const createStatus = async (userId: number, message: string) => {
    const result = await pool.query(
        `INSERT INTO "Status" (user_id, message) VALUES ($1, $2) RETURNING id, message, created_at`,
        [userId, message],
    );
    return result.rows[0];
};

export const deleteStatus = async (userId: number, statusId: number) => {
    try {
        const status = await pool.query('SELECT * FROM "Status" WHERE id = $1', [statusId]);
        if (!status.rows[0]) {
            throw new Error('Status not found');
        }
        if (status.rows[0].user_id !== userId) {
            throw new Error('Unauthorized');
        }
        await pool.query('DELETE FROM "Status" WHERE id = $1', [statusId]);
    } catch (err) {
        // console.error('Error deleting status:', err);
        throw err;
    }
};

export const getAllStatuses = async () => {
    const result = await pool.query(`
        SELECT 
            s.id, s.message, s.created_at, s.user_id, u.username
        FROM 
            "Status" s
        JOIN 
            "User" u ON s.user_id = u.id
        ORDER BY 
            s.created_at DESC
    `);
    return result.rows;
};
