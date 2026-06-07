const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { sendEmail } = require('../emailService');
const { sendSMS }   = require('../smsService');

const app = express();
app.use(cors({
  origin: 'https://novahospitalweb.vercel.app', // replace with your frontend URL in production
  methods: ['GET', 'POST']
}));
app.use(express.json());

app.post('/api/appointment', async (req, res) => {
  const { name, email, phone, department, date, message } = req.body;
  console.log("req body", req.body);
  

  if (!name || !email || !phone || !department || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Send confirmation email to patient
    await sendEmail({
      to: email,
      subject: `Appointment Confirmed — NovaMed`,
      html: patientEmailTemplate(name, department, date)
    });

    // Alert hospital staff
    // await sendEmail({
    //   to: process.env.HOSPITAL_EMAIL,
    //   subject: `New Appointment: ${name} — ${department}`,
    //   html: staffEmailTemplate(name, email, phone, department, date, message)
    // });

    // Send SMS to patient
    // await sendSMS(phone,
    //   `Hi ${name}, your NovaMed appointment for ${department} on ${date} is confirmed. Questions? Call 1-800-NOVAMED.`
    // );

    res.json({ success: true, message: 'Appointment booked!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Email templates
function patientEmailTemplate(name, dept, date) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#0F172A;padding:24px;text-align:center">
        <h1 style="color:#06B6D4;margin:0;font-size:22px">NovaMed</h1>
      </div>
      <div style="padding:32px;border:1px solid #E2E8F0">
        <h2 style="color:#0F172A">Appointment Confirmed ✅</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your appointment has been successfully booked.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:10px;background:#F8FAFC;font-weight:bold">Department</td>
              <td style="padding:10px">${dept}</td></tr>
          <tr><td style="padding:10px;background:#F8FAFC;font-weight:bold">Date</td>
              <td style="padding:10px">${date}</td></tr>
          <tr><td style="padding:10px;background:#F8FAFC;font-weight:bold">Emergency</td>
              <td style="padding:10px;color:#DC2626">1-800-NOVAMED</td></tr>
        </table>
        <p style="color:#64748B;font-size:13px">Please arrive 15 minutes early. Carry a valid ID and insurance card.</p>
      </div>
    </div>`;
}

function staffEmailTemplate(name, email, phone, dept, date, msg) {
  return `<div style="font-family:sans-serif;padding:24px">
    <h2 style="color:#0F172A">New Appointment Request</h2>
    <p><b>Patient:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Department:</b> ${dept}</p>
    <p><b>Date:</b> ${date}</p>
    <p><b>Message:</b> ${msg || 'None'}</p>
  </div>`;
}

app.get('/', (req, res) => {
  res.json({ status: 'NovaMed API is running' });
});

// ✅ Required for Vercel — export the app
module.exports = app;

// ✅ Also keep listen for local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}