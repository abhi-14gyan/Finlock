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


// const nodemailer = require("nodemailer");

// const sendEmail = async function ({ to, subject, html }) {
//   // Create the transporter
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_USER,      // your Gmail address
//       pass: process.env.GMAIL_PASS       // app password (not your real password)
//     },
//   });

//   // Email content
//   const mailOptions = {
//     from: `Finlock <${process.env.GMAIL_USER}>`,  // From Finlock (custom name)
//     to,
//     subject,
//     html,
//   };

//   // Send the email
//   try {
//     console.log("📧 Sending email to:", to);
//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.response);
//     return { success: true, data: info };
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//     return { success: false, error };
//   }
// };

// module.exports = { sendEmail };
