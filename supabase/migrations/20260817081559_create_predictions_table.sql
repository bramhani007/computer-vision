/*
# Create predictions table for animal recognition history

1. Purpose
   Stores every animal species prediction made by the EfficientNet-B0 model,
   including the uploaded image reference, predicted species, confidence score,
   and timestamp. This table backs the History page and the Wildlife Monitoring
   Dashboard statistics and charts.

2. New Table: predictions
   - id          (bigint, primary key, auto-incrementing) — unique prediction record ID
   - image_name  (text, not null) — original filename of the uploaded image
   - image_path  (text, not null) — URL or path where the uploaded image is stored
   - species     (text, not null) — predicted animal species name from the model
   - confidence  (double precision, not null) — model confidence percentage (0–100)
   - created_at  (timestamptz, default now) — when the prediction was recorded

3. Indexes
   - idx_predictions_created_at — speeds up ordering history and trend charts by date
   - idx_predictions_species    — speeds up species filtering and distribution stats

4. Security
   - Row Level Security enabled on predictions.
   - This is a single-tenant app with no sign-in screen, so the anon-key frontend
     needs full CRUD access. Four policies (select/insert/update/delete) are created
     scoped to TO anon, authenticated with USING (true) / WITH CHECK (true) because
     the data is intentionally shared/public across all visitors.
*/

CREATE TABLE IF NOT EXISTS predictions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image_name text NOT NULL,
  image_path text NOT NULL,
  species text NOT NULL,
  confidence double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_species ON predictions (species);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_predictions" ON predictions;
CREATE POLICY "anon_select_predictions"
  ON predictions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_predictions" ON predictions;
CREATE POLICY "anon_insert_predictions"
  ON predictions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_predictions" ON predictions;
CREATE POLICY "anon_update_predictions"
  ON predictions FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_predictions" ON predictions;
CREATE POLICY "anon_delete_predictions"
  ON predictions FOR DELETE
  TO anon, authenticated
  USING (true);
