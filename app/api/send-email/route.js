// app/api/send-email/route.js

import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { render } from '@react-email/components'; // Import from @react-email/components
import WelcomeEmail from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { to, name, subject } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: 'Missing "to" email address' }, 
        { status: 400 }
      );
    }

    // Construct JSX element outside try/catch (React best practice)
    const emailElement = WelcomeEmail({ name: name || 'User' });

    // Render the template on the server - AWAIT is crucial here!
    const html = await render(emailElement);

    const data = await resend.emails.send({
      from: 'Formoteka <formoteka@formoteka.com>',
      to: to,
      subject: subject || 'з Formoteka',
      html: html,
    });

    // console.log('✅ Email sent successfully via Resend');

    return NextResponse.json({ success: true, data });
  } catch (error) {    
    return NextResponse.json(
      { 
        error: error.message,
        details: error.toString() 
      }, 
      { status: 500 }
    );
  }
}
