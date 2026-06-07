async function sendSMS(phone, message) {
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': process.env.FAST2SMS_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: 'q',         // 'q' = quick transactional SMS
      message: message,
      numbers: phone,    // Indian number without +91
      flash: 0
    })
  });

  const data = await response.json();

  if (!data.return) {
    console.error('SMS failed:', data);
    throw new Error('SMS delivery failed');
  }

  console.log(`SMS sent to ${phone}`);
  return data;
}

module.exports = { sendSMS };