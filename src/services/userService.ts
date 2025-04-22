import { pool } from '../lib/db';

export const createUser = async (username: string, password: string) => {
    const result = await pool.query('INSERT INTO "User" (username, password) VALUES ($1, $2) RETURNING id, username', [
        username,
        password,
    ]);
    return result.rows[0];
};

export const findUserByUsername = async (username: string) => {
    const result = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
    return result.rows[0];
};

export const findUserById = async (id: number) => {
    const result = await pool.query('SELECT id, username FROM "User" WHERE id = $1', [id]);
    return result.rows[0];
};
