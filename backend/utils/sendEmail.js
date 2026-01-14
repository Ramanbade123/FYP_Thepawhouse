const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"The Paw House" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    attachments: options.attachments,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to The Paw House! 🐾',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to The Paw House</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .button { background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .footer { padding: 20px; text-align: center; background-color: #f0f0f0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to The Paw House! 🐕</h1>
        </div>
        <div class="content">
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
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
              Go to Dashboard
            </a>
          </div>
          <p>Best regards,<br>The Paw House Team 🐾</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} The Paw House. All rights reserved.</p>
          <p>If you didn't create this account, please contact us immediately.</p>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request - The Paw House',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .button { background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .footer { padding: 20px; text-align: center; background-color: #f0f0f0; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to create a new password:</p>
          <div class="warning">
            <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} The Paw House. All rights reserved.</p>
          <p>For security reasons, never share your password or this link with anyone.</p>
        </div>
      </body>
      </html>
    `,
  }),

  // Add more templates as needed
  accountVerification: (verificationUrl, name) => ({
    subject: 'Verify Your Account - The Paw House',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .button { background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .footer { padding: 20px; text-align: center; background-color: #f0f0f0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Verify Your Account</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with The Paw House! Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">
              Verify Email
            </a>
          </div>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} The Paw House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  }),

  adoptionApproval: (petName, adopterName) => ({
    subject: `Adoption Approved for ${petName}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Adoption Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(to right, #008737, #085558); padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .button { background: #008737; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .footer { padding: 20px; text-align: center; background-color: #f0f0f0; font-size: 12px; color: #666; }
          .highlight { background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Adoption Approved! 🎉</h1>
        </div>
        <div class="content">
          <h2>Congratulations ${adopterName}!</h2>
          <div class="highlight">
            <p><strong>Great news!</strong> Your adoption application for <strong>${petName}</strong> has been approved!</p>
          </div>
          <p>Next steps:</p>
          <ol>
            <li>Contact the shelter/rehomer to schedule a meet & greet</li>
            <li>Complete any remaining paperwork</li>
            <li>Prepare your home for your new family member</li>
            <li>Pick up your new pet on the scheduled date</li>
          </ol>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
              View Details
            </a>
          </div>
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} The Paw House. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };