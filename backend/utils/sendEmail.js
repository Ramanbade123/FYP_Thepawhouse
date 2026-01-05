const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"The Paw House" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to The Paw House! 🐾',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to The Paw House! 🐕</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2>Hello ${name},</h2>
          <p>Thank you for joining The Paw House family! We're excited to have you on board.</p>
          <p>With your account, you can:</p>
          <ul>
            <li>Browse and adopt dogs</li>
            <li>Rehome dogs in need</li>
            <li>Save your favorite pets</li>
            <li>Track your adoption process</li>
            <li>Connect with other pet lovers</li>
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p>Best regards,<br>The Paw House Team 🐾</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request - The Paw House',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Paw House Team 🐾</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };