// api/sendVerificationEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { receiverEmail, verificationToken } = req.body;

        // Define SMTP credentials directly in the code
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailersend.net', // Replace with your SMTP host
            port: 587, // Use 587 for TLS, or 465 for SSL if needed
            secure: false, // Set to true if using SSL on port 465
            auth: {
                user: 'MS_oIga09@pandaprofessor.xyz', // Replace with your SMTP user
                pass: 'GCGmcg12nQn0ZXIq', // Replace with your SMTP password
            },
        });

        // Hardcode the base URL if needed
        const verificationLink = `https://pandaprofessor.xyz/verify?token=${verificationToken}`;

        const mailOptions = {
            from: 'MS_oIga09@pandaprofessor.xyz', // Replace with your "from" email
            to: receiverEmail,
            subject: 'Welcome to Panda Professor',
            text: `Hey there!\n\nThanks for joining us at Panda Professor. Please verify your email by clicking the link below:\n${verificationLink}\n\nThank you!`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error.message); // Log the error message for debugging
            console.error('Full error details:', error); // Log full error details for further debugging
            res.status(500).json({ error: 'Failed to send email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
