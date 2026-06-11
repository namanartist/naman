const fetch = require('node-fetch'); // Make sure you have node-fetch installed

// Telegram Bot details
const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID_HERE';

async function sendToTelegram(messageText) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: CHAT_ID,
    text: messageText,
    parse_mode: 'HTML' // You can also use 'MarkdownV2'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('Message transmitted to Telegram successfully!');
    } else {
      console.error('Failed to send message to Telegram:', data.description);
    }
  } catch (error) {
    console.error('Error transmitting to Telegram:', error);
  }
}

// Example usage: You could use this to receive contact form submissions or alerts
const sampleMessage = `
🚀 <b>New Contact Form Submission</b>
<b>Name:</b> Naman Lahariya
<b>Email:</b> example@email.com
<b>Message:</b> Let's connect and build something awesome!
`;

sendToTelegram(sampleMessage);
