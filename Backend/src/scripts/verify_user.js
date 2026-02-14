const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../.env' });

const supabaseUrl = 'https://csyzgajyfzjlwyxdudyj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Env vars missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verify() {
    console.log('Verifying user isaac2005pech@gmail.com...');

    // 1. Get user from Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error('Auth Error:', authError);
        return;
    }

    const user = users.find(u => u.email === 'isaac2005pech@gmail.com');

    if (!user) {
        console.log('User not found in Auth system.');
        return;
    }

    console.log('User Found:', user.id);
    console.log('User Metadata:', user.user_metadata);

    // 2. Check Profiles table
    console.log('Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Profile Error:', profileError);
    } else {
        console.log('Profile Data:', profile);
    }
}

verify();
