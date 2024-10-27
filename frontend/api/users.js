import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.status(200).json({ name: 'John Doe' });
    }
    else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};