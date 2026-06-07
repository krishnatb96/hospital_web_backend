const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,  // your Brevo login email
    pass: process.env.BREVO_SMTP_PASS   // the SMTP key you generated
  }
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: 'krishna.valttech@gmail.com',
    to, 
    subject,
    html
  });
  console.log(`Email sent to ${to}`);
}

module.exports = { sendEmail };