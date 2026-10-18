CREATE TABLE IF NOT EXISTS learning_state (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  namespace text NOT NULL,
  value jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, namespace)
);
CREATE TABLE IF NOT EXISTS learning_completion (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  topic text NOT NULL,
  module text NOT NULL,
  label text NOT NULL,
  route text NOT NULL,
  first_correct_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);
