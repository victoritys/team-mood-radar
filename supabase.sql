-- 1. Create the teams table
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  invite_code text UNIQUE NOT NULL,
  admin_secret uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- 2. Turn on Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public read/write (since we don't have authenticated users yet, we rely on the admin_secret internally for security)
CREATE POLICY "Enable read access for all users" ON teams FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON teams FOR UPDATE USING (true) WITH CHECK (true);
