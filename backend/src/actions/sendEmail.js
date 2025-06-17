const { Resend } = require("resend");

const sendEmail = async function ({ to, subject, html }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    console.log("Sending email to:", to);
    const data = await resend.emails.send({
      from: 'Finlock <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
