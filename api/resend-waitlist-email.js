// /api/resend-waitlist-email.js
// Usage: POST { email, name } to trigger a waitlist email (requires SENDGRID_API_KEY in env)

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'no-reply@lighttradeforex.com',
      to: email,
      bcc: 'lighttradeforex@gmail.com', // Admin receives a copy of every waitlist email
      subject: 'LightTrade Academy Waitlist',
      text: `Hi${name ? ' ' + name : ''}, thank you for joining the waitlist! We will notify you when access opens.`,
      html: `<p>Hi${name ? ' ' + name : ''},</p><p>Thank you for joining the waitlist! We will notify you when access opens.</p>`
    });
    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Resend API error' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

