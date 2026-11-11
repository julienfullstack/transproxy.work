-- Existing rows stay 'none'. Only a new signup while delivery is configured can
-- enqueue a welcome; deployments and provider setup never backfill old contacts.
ALTER TABLE waitlist_entries
  ADD COLUMN IF NOT EXISTS welcome_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS welcome_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS welcome_next_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_first_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_lease_until timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_lease_token uuid,
  ADD COLUMN IF NOT EXISTS welcome_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcome_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS waitlist_welcome_pending_idx
  ON waitlist_entries (welcome_next_attempt_at)
  WHERE welcome_status IN ('pending', 'sending');
