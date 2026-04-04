# Security Policy

## Supported Versions

JT Dev Studio is an actively maintained single-version application. Security updates are applied to the current production deployment at [jt-devstudio.tech](https://jt-devstudio.tech).

| Version | Supported |
|---|---|
| Current (main branch) | Yes |
| Older deployments | No |

---

## Security Features

This application implements the following security controls:

**Infrastructure**
- HTTPS enforced via HSTS header (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy` — camera, microphone, and geolocation disabled

**Database**
- Row-Level Security (RLS) enforced on all Supabase tables
- Foreign key constraints with cascade deletes
- No sensitive data stored client-side

**API & Input Handling**
- Zod schema validation on all user inputs
- DOMPurify sanitization on all user-generated HTML content
- Rate limiting on payment endpoints via Upstash Redis (sliding window)
- Webhook signature verification for Stripe and Coinbase Commerce

**Authentication**
- OAuth 2.0 via Supabase (GitHub, Google)
- Server-side session validation on every request via middleware
- Auth callback redirect validation (relative paths only)

**Secrets Management**
- All API keys and secrets stored in environment variables only
- No secrets committed to version control
- `.env.local` excluded via `.gitignore`

---

## Reporting a Vulnerability

If you discover a security vulnerability in JT Dev Studio, please report it responsibly.

**Contact:** j.torres3.dev@gmail.com
**Subject line:** `[SECURITY] JT Dev Studio - <brief description>`

**Please include:**
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested remediation (optional)

**What to expect:**
- Acknowledgment within 48 hours
- Status update within 7 days
- Credit in release notes if desired (for valid reports)

**Please do not** open a public GitHub issue for security vulnerabilities. Use the email above.

---

## Out of Scope

The following are not considered vulnerabilities for this project:

- Issues in third-party dependencies (report directly to those maintainers)
- Missing rate limiting on non-payment endpoints (acceptable tradeoff)
- Lack of multi-factor authentication for end users
- Social engineering attacks
- Physical security issues

---

*Last reviewed: April 2026*
