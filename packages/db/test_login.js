const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/krishanbandara/Documents/2026 new projects/productix/packages/db/.env' });

async function run() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log("Attempting login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'company1@productix.com',
    password: 'somepassword123' 
  });
  console.log("Login result:", error ? error.message : "Success ID: " + data.user.id);
}
run();
