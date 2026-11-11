CREATE TABLE IF NOT EXISTS waitlist_entries (
  id uuid PRIMARY KEY,
  email_digest char(64) NOT NULL UNIQUE,
  encrypted_email text NOT NULL,
  consent_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE waitlist_entries IS 'Adult opt-in waiting list. Email is AES-256-GCM encrypted by the API; no plaintext contacts or IP addresses.';
