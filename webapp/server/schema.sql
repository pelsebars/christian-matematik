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

-- Store the award with the permanent completion, independently of set scores.
-- The default also credits existing completions once when upgrading.
ALTER TABLE learning_completion ADD COLUMN IF NOT EXISTS points_awarded integer NOT NULL DEFAULT 1 CHECK (points_awarded >= 0);

CREATE TABLE IF NOT EXISTS shop_purchase (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  request_id text NOT NULL,
  item_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('skin','reward')),
  name text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz,
  PRIMARY KEY (user_id, request_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS shop_skin_once ON shop_purchase(user_id,item_id) WHERE kind='skin';
CREATE TABLE IF NOT EXISTS shop_profile (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  active_skin text NOT NULL DEFAULT 'default'
);

-- Repeated practice earns the full automatic score once per distinct set.
CREATE TABLE IF NOT EXISTS bank_set_reward (
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  set_id text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('training','exam')),
  definition text,
  points numeric(14,6) NOT NULL DEFAULT 0 CHECK (points >= 0),
  legacy_points numeric(14,6) NOT NULL DEFAULT 0 CHECK (legacy_points >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,set_id)
);
-- Retain old one-point awards, counting them towards (not on top of) the
-- corresponding set's score. A legacy award can offset only one set.
CREATE TABLE IF NOT EXISTS bank_reward_legacy (
  user_id text NOT NULL,
  exercise_id text NOT NULL,
  set_id text NOT NULL,
  points integer NOT NULL CHECK (points > 0),
  PRIMARY KEY(user_id,exercise_id),
  FOREIGN KEY(user_id,exercise_id) REFERENCES learning_completion(user_id,exercise_id) ON DELETE CASCADE,
  FOREIGN KEY(user_id,set_id) REFERENCES bank_set_reward(user_id,set_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tutor_usage (
  user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  bucket timestamptz NOT NULL,
  requests integer NOT NULL DEFAULT 0
);
