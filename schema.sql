CREATE TABLE moods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood IN (1, 0, -1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster daily lookups
CREATE INDEX idx_moods_created_at ON moods(created_at);
