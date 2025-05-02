import pool from './config/db.js';
import bcrypt from 'bcryptjs';

const seedDB = async () => {
  try {
    // Reset the state of DB
    await pool.query(
      'TRUNCATE TABLE messages, participants, conversations, users RESTART IDENTITY CASCADE'
    );

    // Insert users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)',
      [
        'alice',
        'alice@example.com',
        hashedPassword,
        'bob',
        'bob@example.com',
        hashedPassword,
        'charlie',
        'charlie@example.com',
        hashedPassword,
      ]
    );

    // Insert conversations
    await pool.query(
      'INSERT INTO conversations (name) VALUES ($1), ($2), ($3)',
      ['Alice & Bob', 'Bob & Charlie', 'Alice & Charlie']
    );

    // Insert participants
    await pool.query(
      'INSERT INTO participants (user_id, conversation_id) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10), ($11, $12)',
      [1, 1, 2, 1, 2, 2, 3, 2, 1, 3, 3, 3]
    );

    // Insert messages
    await pool.query(
      `
        INSERT INTO messages (sender_id, receiver_id, conversation_id, message)
        VALUES
          ($1, $2, $3, $4),
          ($5, $6, $7, $8),
          ($9, $10, $11, $12),
          ($13, $14, $15, $16),
          ($17, $18, $19, $20),
          ($21, $22, $23, $24),
          ($25, $26, $27, $28),
          ($29, $30, $31, $32)
        `,
      [
        1,
        2,
        1,
        'Hi Bob!',
        2,
        1,
        1,
        'Hey Alice! How are you?',
        1,
        2,
        1,
        'I am good, thanks!',
        2,
        3,
        2,
        'Charlie, what are you up to?',
        3,
        2,
        2,
        'Just coding. You?',
        2,
        3,
        2,
        'Same here!',
        1,
        3,
        3,
        "Charlie, let's meet up!",
        3,
        1,
        3,
        'Sure, when?',
      ]
    );

    console.log('Db seeded successfully');
  } catch (err) {
    console.log('Error seeding DB', err.message);
  } finally {
    pool.end();
  }
};

seedDB();
