// api/sendVerificationEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { receiverEmail, verificationToken } = req.body;

        // Set up the SMTP transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailersend.net',
            port: 587,
            secure: false,
            auth: {
                user: 'MS_oIga09@pandaprofessor.xyz',
                pass: 'GCGmcg12nQn0ZXIq',
            },
        });

        // Create the verification link
        const verificationLink = `https://milkysports.com/verify?token=${verificationToken}`;

        const mailOptions = {
            from: 'MS_oIga09@pandaprofessor.xyz',
            to: receiverEmail,
            subject: 'Welcome to Panda Professor',
            text: `Hey there!\n\nThanks for joining us at Panda Professor. Please verify your email by clicking the link below:\n${verificationLink}\n\nThank you!`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
