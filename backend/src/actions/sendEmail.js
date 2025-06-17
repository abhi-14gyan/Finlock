const {Resend} = require("resend");


const sendEmail = async function ({ to, subject, html }) {
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try {

        const data = await resend.emails.send({
            from: 'Finlock <onboarding@resend.dev>',
            to,
            subject,
            html,

        });

        return {success: true, data};

    } catch (error) {
        console.error("Failed to send Email",email);
        return {success: false , error};
    }
}

module.exports = {sendEmail};