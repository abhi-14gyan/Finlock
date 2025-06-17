const { Resend } = require("resend");
const { render } = require("@react-email/render");

const sendEmail = async function ({ to, subject, html, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    const emailHtml = html || (react ? render(react) : "");

    const data = await resend.emails.send({
      from: 'Finlock <onboarding@resend.dev>',
      to,
      subject,
      html: emailHtml,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Email to", to, error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
