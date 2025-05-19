const nodemailer = require('nodemailer');
require('dotenv').config();


const sendContactMessage = async (messageData) => {
    try {
        // Create transporter (production-safe Gmail config)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            },
        });

        // Email options
        const mailOptions = {
            from: messageData.email,
            to: process.env.EMAIL,
            subject: `Want to become a Restaurant Owner: ${messageData.subject}`,
            html: `
                <h3>Restaurant Owner Request</h3>
                <p><strong>From:</strong> ${messageData.name} (${messageData.email})</p>
                <p><strong>Subject:</strong> ${messageData.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${messageData.message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return { success: true };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    sendContactMessage
}; 