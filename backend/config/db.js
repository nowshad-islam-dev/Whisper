import pkg from 'pg';
const { Pool } = pkg;
import { host, port, user, password, database } from './index.js';

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // in ms

const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
});

const connectWithRetry = async () => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await pool.query('SELECT 1'); // test query
      console.log('✅ Connected to Postgres');
      break; // exit loop if successful
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

export default pool;
export { connectWithRetry as connectDB };
