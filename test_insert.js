const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('moods').insert({
    session_id: 'test_session_123',
    mood: 1,
    team_id: 'Design'
  });
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
