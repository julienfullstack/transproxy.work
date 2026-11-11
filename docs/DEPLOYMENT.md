# Deployment

This document describes the initial waiting-list deployment. The member platform,
records vault, public reports and other roadmap features are not deployed by this
setup. Deployment status and resource IDs are recorded privately in the release
session; this document does not itself certify that a release is live.

## Independent resources

Use a new Coolify project named `transproxy` on the existing self-hosted server,
with a `production` environment and three new resources:

| Resource | Configuration |
| --- | --- |
| `transproxy-frontend` | Public repository, branch `main`, reviewed commit pinned; Dockerfile build, base directory `/`, Dockerfile `/Dockerfile`; nginx on port 80. |
| `transproxy-api` | Same repository and pinned commit; Dockerfile build, base directory `/server`, Dockerfile `/Dockerfile`; Node on port 3001; no public domain or host-port mapping. |
| `transproxy-postgres` | PostgreSQL 17, separate database/user/password and persistent database storage; no public database port. |

The source repository is `https://github.com/julienfullstack/transproxy.work`.
Disable automatic deployments and preview deployments. A source push does not
replace a deliberate deployment of the reviewed revision. Do not reuse or alter
Cruush, Mount Sinai or other existing resources, databases, keys or policies.

Assign the API the Docker network alias `transproxy-api-internal`. The frontend
proxies browser requests under `/api/` to that alias on port 3001. Browser requests
stay on the frontend origin; no public API hostname is required. Preserve the
browser's `Origin` header when proxying.

The intended ingress chain is Coolify's reverse proxy, then nginx, then the API.
`TRUST_PROXY_HOPS=2` applies only to that exact chain with no public API host port.
Recheck it if the ingress topology changes; do not blindly trust arbitrary
forwarded addresses.

## Runtime configuration

Store secret values in the new resources' private Coolify environment settings.
Do not place real values in Git, Docker build arguments, deployment logs or public
documentation. `.env.example` contains local placeholders only.

| Resource | Runtime variable | Purpose |
| --- | --- | --- |
| Frontend | `API_UPSTREAM` | `http://transproxy-api-internal:3001` |
| API | `NODE_ENV` | Production runtime. |
| API | `PORT` | API listening port, 3001. |
| API | `DATABASE_URL` | New private TransProxy database connection. |
| API | `CORS_ORIGINS` | Exact allowed origins: `https://transproxy.org,https://www.transproxy.org`. |
| API | `WAITLIST_ENCRYPTION_KEY` | Unique random 32-byte key encoded as 64 hex characters. |
| API | `WAITLIST_LOOKUP_KEY` | A different random 32-byte key encoded as 64 hex characters for duplicate lookup/removal. |
| API | `TRUST_PROXY_HOPS` | Two trusted proxy hops in the described deployment. |

The API applies the idempotent waiting-list migration at startup. Email addresses
are encrypted before database storage; duplicate matching uses the separately
keyed digest. The waiting list has no public read endpoint. Signup does not send
email, and this deployment needs no email-provider credentials.

Both application keys are required for recovery and must be preserved when
redeploying. They live in the API's Coolify configuration, separately from
Postgres. Replacing either key without a deliberate migration can break access,
duplicate handling or removal of existing entries. A database backup alone is
insufficient to recover the waiting list. Protect a separate recovery copy of the
keys through the operator's secret-storage process before promising recoverability.

Persistent database storage survives application rebuilds. This setup does not
claim an offsite backup schedule, retention guarantee or completed restore drill.
Those require separate configuration and verification.

## Health checks and domain

- Frontend health: `GET /health` on loopback port 80.
- API health: `GET /api/health` on loopback port 3001, including a database probe.
- The API's Node image has no curl/wget dependency. Configure Coolify's command
  health check as `node /app/dist/health.js`; the Docker image uses the same helper.
- Keep health checks enabled so Coolify waits for the new container before retiring
  the previous application container.

Point only the apex and `www` DNS records for `transproxy.org` to the existing
server. Preserve mail records and unrelated DNS settings. Configure Coolify for
`https://transproxy.org` and `https://www.transproxy.org`, with the apex as the
canonical host. Verify valid certificates without bypassing certificate errors.

## Release verification

Before pushing or deploying, list environment-variable additions or changes and
review the complete task-owned diff. Build both applications and run the focused
waiting-list checks, including real PostgreSQL encryption and duplicate handling.
Deploy the exact reviewed commit into the new resources.

Check the live desktop and mobile page using normal styling and representative
state. Confirm a browser signup reaches the real API, is encrypted in the private
database, and receives the correct success/error response. Check repeated signup,
age/consent validation, unavailable-service behavior and the absence of a public
waiting-list read endpoint. Remove synthetic verification entries afterwards.
Never print real subscriber addresses, ciphertext contents, secrets or private
application logs as evidence. Record counts and pass/fail results instead.

## Remove a waiting-list entry

The API image includes `node dist/remove.js`, also available as
`npm run waitlist:remove`. It accepts one email through standard input, calculates
the private lookup digest and removes the matching active entry. It returns a
generic completion message; it does not disclose whether the address was present.
No public removal or decryption endpoint is exposed.

An authorized operator can run the following in a Bash shell on the server after
identifying the current **TransProxy API** container. Replace only the container
placeholder. The hidden prompt keeps the email out of shell history and process
arguments; the value travels to the container on standard input.

```bash
IFS= read -r -s -p 'Waiting-list email to remove: ' transproxy_contact
printf '\n'
printf '%s\n' "$transproxy_contact" | docker exec -i <current-transproxy-api-container> node dist/remove.js
unset transproxy_contact
```

Do not substitute the email directly into a command. If the removal fails, inspect
private runtime configuration without logging the contact value. Removal here
covers the active database; no unverified backup-deletion claim is made.
