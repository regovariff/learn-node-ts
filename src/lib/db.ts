import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// test cdb connection
pool.connect()
    .then((client) => {
        console.log('✅ PostgreSQL connected');
        client.release();
    })
    .catch((err) => {
        console.error('❌ PostgreSQL connection error:', err);
        process.exit(1);
    });
