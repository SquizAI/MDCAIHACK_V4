import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create tables
const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Registrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        team TEXT,
        experience TEXT,
        skills TEXT,
        dietary TEXT,
        tshirt TEXT,
        expectations TEXT,
        phone TEXT,
        type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        created_by INTEGER NOT NULL REFERENCES registrations(id),
        max_members INTEGER DEFAULT 4,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Team requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_requests (
        id SERIAL PRIMARY KEY,
        team_id INTEGER NOT NULL REFERENCES teams(id),
        requester_id INTEGER NOT NULL REFERENCES registrations(id),
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Team members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        team_id INTEGER NOT NULL REFERENCES teams(id),
        registration_id INTEGER NOT NULL REFERENCES registrations(id),
        role TEXT DEFAULT 'member' CHECK(role IN ('leader', 'member')),
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Teammates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teammates (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER NOT NULL REFERENCES registrations(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL
      )
    `);

    // Volunteer availability table
    await client.query(`
      CREATE TABLE IF NOT EXISTS volunteer_availability (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER NOT NULL REFERENCES registrations(id),
        day TEXT NOT NULL
      )
    `);

    // Volunteer tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS volunteer_tasks (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER NOT NULL REFERENCES registrations(id),
        task_id INTEGER NOT NULL
      )
    `);

    // Welcome message table
    await client.query(`
      CREATE TABLE IF NOT EXISTS welcome_message (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

setupDatabase().catch(console.error);

export default pool;