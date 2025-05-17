const nodemailer = require('nodemailer');
require('dotenv').config();


const sendContactMessage = async (messageData) => {
    try {

     
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: messageData.email,
            to: process.env.EMAIL, // Sending to yourself
            subject: `New Contact Message: ${messageData.subject}`,
            html: `
                <h3>New Contact Message</h3>
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