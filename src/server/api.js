import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import db from './db/setup.js';

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Get available teams
router.get('/teams', (req, res) => {
  db.all(`
    SELECT t.*, COUNT(tm.id) as current_members 
    FROM teams t 
    LEFT JOIN team_members tm ON t.id = tm.team_id 
    GROUP BY t.id 
    HAVING current_members < t.max_members
  `, [], (err, teams) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
    res.json(teams);
  });
});

// Send team request
router.post('/teams/request', (req, res) => {
  const { teamId, requesterId } = req.body;

  db.run(`
    INSERT INTO team_requests (team_id, requester_id)
    VALUES (?, ?)
  `, [teamId, requesterId], function(err) {
    if (err) {
      console.error('Error creating team request:', err);
      return res.status(500).json({ error: 'Failed to create team request' });
    }

    // Notify team leader
    db.get(`
      SELECT r.email, t.name as team_name, r2.name as requester_name
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      JOIN registrations r ON tm.registration_id = r.id
      JOIN registrations r2 ON r2.id = ?
      WHERE t.id = ? AND tm.role = 'leader'
    `, [requesterId, teamId], async (err, data) => {
      if (!err && data) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: data.email,
            subject: 'New Team Request',
            html: `
              <h1>New Team Request</h1>
              <p>${data.requester_name} has requested to join your team "${data.team_name}".</p>
              <p>You can accept or reject this request from your dashboard.</p>
            `
          });
        } catch (emailErr) {
          console.error('Failed to send team request email:', emailErr);
        }
      }
    });

    res.json({ success: true, requestId: this.lastID });
  });
});

// Registration endpoint
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    teamStatus,
    team,
    experience,
    skills,
    dietary,
    tshirt,
    expectations,
    phone,
    type,
    availability,
    selectedTasks
  } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    try {
      // Insert main registration
      db.run(`
        INSERT INTO registrations (
          name, email, password_hash, experience, skills,
          dietary, tshirt, expectations, phone, type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, email, hashedPassword, experience || null, 
        skills || null, dietary || null, tshirt || null, 
        expectations || null, phone || null, type
      ], async function(err) {
        if (err) {
          console.error('Registration error:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Registration failed' });
        }

        const registrationId = this.lastID;

        // Handle team creation/joining
        if (teamStatus === 'create' && team) {
          db.run(`
            INSERT INTO teams (name, created_by, max_members)
            VALUES (?, ?, 4)
          `, [team, registrationId], function(err) {
            if (err) {
              console.error('Team creation error:', err);
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Team creation failed' });
            }

            // Add creator as team leader
            db.run(`
              INSERT INTO team_members (team_id, registration_id, role)
              VALUES (?, ?, 'leader')
            `, [this.lastID, registrationId]);
          });
        } else if (teamStatus === 'join' && team) {
          // Create team request
          db.run(`
            INSERT INTO team_requests (team_id, requester_id)
            VALUES (?, ?)
          `, [team, registrationId]);
        }

        // Handle volunteer availability
        if (availability && availability.length > 0) {
          const availabilityStmt = db.prepare(`
            INSERT INTO volunteer_availability (registration_id, day)
            VALUES (?, ?)
          `);

          availability.forEach(day => {
            availabilityStmt.run([registrationId, day]);
          });
          availabilityStmt.finalize();
        }

        // Handle volunteer tasks
        if (selectedTasks && selectedTasks.length > 0) {
          const taskStmt = db.prepare(`
            INSERT INTO volunteer_tasks (registration_id, task_id)
            VALUES (?, ?)
          `);

          selectedTasks.forEach(taskId => {
            taskStmt.run([registrationId, taskId]);
          });
          taskStmt.finalize();
        }

        // Send welcome email
        try {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to BUILD THE FUTURE Hackathon!',
            html: `
              <h1>Welcome to BUILD THE FUTURE Hackathon!</h1>
              <p>Hi ${name},</p>
              <p>Thank you for registering for the BUILD THE FUTURE Hackathon! We're excited to have you join us.</p>
              <p>Your registration details:</p>
              <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
                ${team ? `<li>Team: ${team}</li>` : ''}
                <li>Role: ${type}</li>
              </ul>
              <p>Event Details:</p>
              <ul>
                <li>Date: December 6-8, 2023</li>
                <li>Location: AI Center</li>
              </ul>
              <p>Please keep this email for your records. You can now log in to your dashboard using your email and password.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>The BUILD THE FUTURE Team</p>
            `
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Continue with registration even if email fails
        }

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Commit error:', err);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Transaction failed' });
          }
          res.json({ success: true, registrationId });
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      db.run('ROLLBACK');
      res.status(500).json({ error: error.message || 'Registration failed' });
    }
  });
});

// Rest of the API endpoints remain the same...

export default router;