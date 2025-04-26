import pkg from 'pg';
const { Pool } = pkg;

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // in ms

const connectWithRetry = async () => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await pool.query('SELECT 1'); // test query
      console.log('✅ Connected to Postgres');
      return pool;
    } catch (err) {
      console.log(`❌ DB connection failed (attempt ${i + 1}/${MAX_RETRIES})`);
      console.error(err.message);

      if (i < MAX_RETRIES - 1) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY));
      } else {
        console.log('❌ Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};

export { connectWithRetry as connectDB };
