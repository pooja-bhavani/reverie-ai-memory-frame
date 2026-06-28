-- Reverie — Aurora PostgreSQL vector schema for the photos table.
-- Run after seeding:  psql "$DATABASE_URL" -f infra/aurora_schema.sql

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE photos ADD COLUMN IF NOT EXISTS embedding_vec vector(1024);

UPDATE photos
SET embedding_vec = (embedding::text)::vector
WHERE embedding_vec IS NULL AND embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS photos_embedding_vec_idx
    ON photos USING ivfflat (embedding_vec vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS photos_owner_idx    ON photos (owner);
CREATE INDEX IF NOT EXISTS photos_mood_idx     ON photos (mood);
CREATE INDEX IF NOT EXISTS photos_taken_at_idx ON photos (taken_at);

ANALYZE photos;
