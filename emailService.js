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
  try {
    const info = await transporter.sendMail({
      from: "krishna.valttech@gmail.com",
      to,
      subject,
      html,
    });

    console.log("Email sent:", info);
  } catch (err) {
    console.error("Email Error:", err);
  }
}
console.log("BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER);
console.log("BREVO_SMTP_PASS exists:", !!process.env.BREVO_SMTP_PASS);

module.exports = { sendEmail };