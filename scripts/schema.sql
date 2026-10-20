CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  role text NOT NULL DEFAULT 'parent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS session (
  id text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  scope text,
  password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS account_provider_account_idx ON account (provider_id, account_id);

CREATE TABLE IF NOT EXISTS verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name text NOT NULL,
  age text NOT NULL,
  notes text,
  activity text,
  starts_at timestamptz,
  amount integer,
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE child ADD COLUMN IF NOT EXISTS activity text;
ALTER TABLE child ADD COLUMN IF NOT EXISTS starts_at timestamptz;
ALTER TABLE child ADD COLUMN IF NOT EXISTS amount integer;
ALTER TABLE child ADD COLUMN IF NOT EXISTS paid boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS product (
  id text PRIMARY KEY,
  activity text NOT NULL,
  name text NOT NULL,
  starts_at timestamptz NOT NULL,
  amount integer NOT NULL,
  stripe_product_id text,
  stripe_price_id text,
  active boolean NOT NULL DEFAULT true
);

ALTER TABLE child ADD COLUMN IF NOT EXISTS product_id text REFERENCES product(id);
ALTER TABLE child ADD COLUMN IF NOT EXISTS currency text;
ALTER TABLE child ADD COLUMN IF NOT EXISTS stripe_session_id text;
ALTER TABLE child ADD COLUMN IF NOT EXISTS stripe_product_id text;
CREATE UNIQUE INDEX IF NOT EXISTS child_stripe_purchase_name_idx ON child (stripe_session_id, stripe_product_id, name);
DROP INDEX IF EXISTS child_stripe_purchase_idx;
