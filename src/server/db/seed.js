import pool from './setup.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  const client = await pool.connect();
  try {
    const adminPassword = 'MDCHack2023!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await client.query(`
      INSERT INTO admins (username, password_hash, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          email = EXCLUDED.email
    `, ['admin', hashedPassword, 'admin@mdchackathon.com']);

    console.log('Admin credentials:');
    console.log('Username: admin');
    console.log('Password: MDCHack2023!');

    // Seed welcome message
    await client.query(`
      INSERT INTO welcome_message (message)
      VALUES ($1)
      ON CONFLICT (id) DO UPDATE
      SET message = EXCLUDED.message
    `, ['Welcome to BUILD THE FUTURE Hackathon! We\'re excited to have you join us.']);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    client.release();
  }
};

seedAdmin().catch(console.error);