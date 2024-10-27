// api/verify.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Token is required.' });
        }

        // Query to check for the token and verify the user
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('verification_token', token)
            .single();

        if (error) {
            return res.status(404).json({ message: 'Invalid or expired token.' });
        }

        // Update user to set verified to true
        const { error: updateError } = await supabase
            .from('users')
            .update({ verified: true, verification_token: null }) // Optionally reset the token
            .eq('id', data.id);

        if (updateError) {
            return res.status(500).json({ message: 'Failed to update user.' });
        }

        return res.status(200).json({ message: 'Email verified successfully!' });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
