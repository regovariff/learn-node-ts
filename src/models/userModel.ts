/**
 * RELATIONAL DB model is defined in schema.prisma
 */

/**
 * Prisma handles:
 * Relationships (@relation)
 * Foreign keys (fields, references)
 * Types (String, Int, DateTime, etc.)
 * Defaults (@default(now()), @default(autoincrement()))
 * Constraints (@unique, @id, etc.)
 */

/*
// can also do this if using raw sql without prisma

export const findUserByUsername = async (username: string) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

export const createUser = async (username: string, hashedPassword: string) => {
    const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
    );
    return result.rows[0];
};
*/