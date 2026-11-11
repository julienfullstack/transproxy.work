CREATE TABLE IF NOT EXISTS legal_requests (
  id uuid PRIMARY KEY,
  email_lookup char(64) NOT NULL,
  encrypted_payload text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'awaiting_verification', 'closed')),
  notice_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  response_due_at timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  closed_at timestamptz,
  purge_after timestamptz,
  hold_until timestamptz,
  CHECK ((status = 'closed') = (closed_at IS NOT NULL AND purge_after IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS legal_requests_email_lookup_idx ON legal_requests (email_lookup);
CREATE INDEX IF NOT EXISTS legal_requests_open_idx ON legal_requests (created_at)
  WHERE status <> 'closed';
CREATE INDEX IF NOT EXISTS legal_requests_purge_idx ON legal_requests (purge_after)
  WHERE status = 'closed';

COMMENT ON TABLE legal_requests IS 'Private legal/contact requests. Submitted fields and operator notes are application-encrypted; only opaque references, keyed lookup and operational metadata are queryable.';
