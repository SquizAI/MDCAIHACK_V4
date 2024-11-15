import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mdcaihacks@gmail.com',
    pass: 'MDCAIhacks12!'
  }
});

export const sendWelcomeEmail = async (participant) => {
  const mailOptions = {
    from: 'mdcaihacks@gmail.com',
    to: participant.email,
    subject: 'Welcome to BUILD THE FUTURE Hackathon!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to BUILD THE FUTURE!</h1>
        <p>Hi ${participant.name},</p>
        <p>Thank you for registering for the BUILD THE FUTURE Hackathon! We're excited to have you join us.</p>
        
        <h2 style="color: #1e40af;">Event Details</h2>
        <ul>
          <li>Dates: December 6-8, 2023</li>
          <li>Location: AI Center</li>
          <li>Registration Type: ${participant.type}</li>
        </ul>

        <h2 style="color: #1e40af;">Schedule Overview</h2>
        <p><strong>Day 1 (Dec 6)</strong>: 3:00 PM - 9:00 PM</p>
        <p><strong>Day 2 (Dec 7)</strong>: 9:00 AM - 9:00 PM</p>
        <p><strong>Day 3 (Dec 8)</strong>: 9:00 AM - 4:00 PM</p>

        <p>What to bring:</p>
        <ul>
          <li>Laptop and charger</li>
          <li>Student ID</li>
          <li>Any personal items you'll need</li>
        </ul>

        <p>All meals and refreshments will be provided throughout the event.</p>

        <p style="margin-top: 20px;">If you have any questions before the event, please don't hesitate to reach out to us at mdcaihacks@gmail.com</p>

        <p>Best regards,<br>The BUILD THE FUTURE Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', participant.email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};