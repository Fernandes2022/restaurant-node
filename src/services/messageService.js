const nodemailer = require('nodemailer');
require('dotenv').config();


const sendContactMessage = async (messageData) => {
    try {
        console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Exists' : 'Missing');

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
            subject: messageData.subject,
            html: `
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

const sendOrderOutForDeliveryEmail = async ({ to, orderId, restaurantName, items = [], totals = {} }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            },
        });

        const itemsRowsHtml = items.map(it => `
            <tr>
                <td style="padding:6px 8px;border:1px solid #e5e7eb;">${it.name}</td>
                <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:center;">${it.quantity}</td>
                <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">${Number(it.price).toFixed(2)}</td>
                <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">${Number(it.lineTotal || (Number(it.price)*Number(it.quantity))).toFixed(2)}</td>
            </tr>
        `).join('');

        const itemsLinesText = items.map(it => `- ${it.name} x${it.quantity} = ${(Number(it.lineTotal || (Number(it.price)*Number(it.quantity)))).toFixed(2)}`).join('\n');

        const subject = `Your order ${orderId} is out for delivery`;

        const html = `
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">
                <p>Hi,</p>
                <p>Your order <strong>${orderId}</strong>${restaurantName ? ` from <strong>${restaurantName}</strong>` : ''} is now <strong>OUT FOR DELIVERY</strong>.</p>
                ${items.length ? `
                <h3 style="margin-top:16px;">Items</h3>
                <table style="border-collapse:collapse;border:1px solid #e5e7eb;width:100%;max-width:640px;">
                    <thead>
                        <tr>
                            <th style="text-align:left;padding:8px;border:1px solid #e5e7eb;">Item</th>
                            <th style="text-align:center;padding:8px;border:1px solid #e5e7eb;">Qty</th>
                            <th style="text-align:right;padding:8px;border:1px solid #e5e7eb;">Price</th>
                            <th style="text-align:right;padding:8px;border:1px solid #e5e7eb;">Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRowsHtml}
                    </tbody>
                </table>
                ` : ''}
                <div style="margin-top:16px;">
                    <p><strong>Subtotal:</strong> ${Number(totals.itemsSubtotal || 0).toFixed(2)}</p>
                    ${typeof totals.discountAmount === 'number' ? `<p><strong>Discount:</strong> -${Number(totals.discountAmount).toFixed(2)}</p>` : ''}
                    <p><strong>Delivery Fee:</strong> ${Number(totals.deliveryFee || 0).toFixed(2)}</p>
                    <p><strong>Total:</strong> ${Number(totals.totalAmount || 0).toFixed(2)}</p>
                </div>
                <p style="margin-top:16px;">Thank you for ordering with us!</p>
            </div>
        `;

        const text = [
            `Hi,`,
            `Your order ${orderId}${restaurantName ? ` from ${restaurantName}` : ''} is now OUT FOR DELIVERY.`,
            items.length ? `\nItems:\n${itemsLinesText}` : '',
            `\nSubtotal: ${(Number(totals.itemsSubtotal || 0)).toFixed(2)}`,
            typeof totals.discountAmount === 'number' ? `Discount: -${(Number(totals.discountAmount)).toFixed(2)}` : '',
            `Delivery Fee: ${(Number(totals.deliveryFee || 0)).toFixed(2)}`,
            `Total: ${(Number(totals.totalAmount || 0)).toFixed(2)}`,
            `\nThank you for ordering with us!`
        ].filter(Boolean).join('\n');

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    sendContactMessage,
    sendOrderOutForDeliveryEmail
}; 