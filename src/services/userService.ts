import { pool } from '../lib/db';
import bcrypt from 'bcrypt';

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
    const result = await pool.query(`SELECT id, username, email, fullname, bio, skills FROM "User" WHERE id = $1`, [
        id,
    ]);
    return result.rows[0];
};

export const updateUserProfile = async (
    userId: number,
    {
        email,
        fullname,
        bio,
        skills,
        password,
    }: {
        email?: string;
        fullname?: string;
        bio?: string;
        skills?: string[];
        password?: string;
    },
) => {
    let hashedPassword: string | null = null;

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
        `UPDATE "User"
         SET email = COALESCE($1, email),
             fullname = COALESCE($2, fullname),
             bio = COALESCE($3, bio),
             skills = COALESCE($4, skills),
             password = COALESCE($5, password)
         WHERE id = $6
         RETURNING *`,
        [email, fullname, bio, skills, hashedPassword, userId],
    );

    return result.rows[0];
};
