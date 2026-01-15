// server/emails

export async function sendEmail() {
  // console.log('🚀 sendEmail: Starting...');

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'jackfrunze@ukr.net',
        name: 'John',
        subject: 'Заявка з Formoteka',
      }),
    });

    // console.log('📡 Response status:', response.status);
    // console.log('📡 Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      // console.error('❌ Response not OK. Status:', response.status);
      // console.error('❌ Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    // console.log('✅ Email sent successfully!');
    // console.log('📧 Response data:', data);

    return data;
  } catch (error) {
    // console.error('❌ sendEmail error:', error);
    // console.error('❌ Error message:', error.message);
    // console.error('❌ Error stack:', error.stack);
    throw error;
  }
}
