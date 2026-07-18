# Auth setup (OAuth + password reset)

This document is the source of truth for redirect URIs and provider rotation.
When Google or GitHub sign-in breaks, start here before changing app code.

## Project identifiers

| Item | Value |
|------|--------|
| Supabase project ref | `rtyyywzpdoroqouvskop` |
| Supabase API URL | `https://rtyyywzpdoroqouvskop.supabase.co` |
| Production site URL | `https://jt-devstudio.tech` |
| Local site URL | `http://localhost:3000` |

App code reads `SITE_URL` for OAuth and password-reset redirects. In production
(Vercel) this must be `https://jt-devstudio.tech`.

## Redirect URIs (every one that must be allowlisted)

### 1. Supabase Auth callback (provider → Supabase)

Paste this into **Google Cloud Console** and **GitHub OAuth App** as an
authorized redirect URI:

```
https://rtyyywzpdoroqouvskop.supabase.co/auth/v1/callback
```

Providers never redirect straight to the Next.js app. They hit Supabase first;
Supabase then redirects to the app.

### 2. App auth callback (Supabase → Next.js)

Code in `src/app/login/actions.ts` and password reset use:

```
https://jt-devstudio.tech/auth/callback
http://localhost:3000/auth/callback
```

Password reset adds a safe `next` query:

```
https://jt-devstudio.tech/auth/callback?next=/reset-password
```

### 3. Supabase Dashboard → Authentication → URL Configuration

Ensure these are set:

| Setting | Value |
|---------|--------|
| Site URL | `https://jt-devstudio.tech` |
| Redirect URLs (allow list) | `https://jt-devstudio.tech/**`, `http://localhost:3000/**` |

Without the app callback on this allow list, OAuth and password-reset emails
will fail after the provider step.

## How the code handles redirects

1. User clicks **GitHub** / **Google** on `/login`.
2. Server action calls `signInWithOAuth` with
   `redirectTo: ${SITE_URL}/auth/callback`.
3. User authenticates at the provider.
4. Provider redirects to Supabase:
   `https://<project-ref>.supabase.co/auth/v1/callback`.
5. Supabase redirects to the app `/auth/callback?code=...`.
6. `src/app/auth/callback/route.ts` exchanges the code for a session and
   redirects to `/` (or `next` if present and safe).

If the provider or exchange fails, the callback redirects to
`/login?error=<safe_code>` with a friendly message — never a raw Google/GitHub
error dump.

**Note:** Some Google errors (for example `Error 401: deleted_client`) are shown
on Google's own page and never reach our app. Fix those in Google Cloud +
Supabase credentials (below). Our login page still handles any error query
params Supabase *does* forward.

## JT-TODO: Rotate Google OAuth client (`deleted_client`)

Symptom: "Access blocked: Authorization Error, Error 401: deleted_client".

The Google Cloud OAuth client Supabase is using was deleted. App code cannot
fix this — recreate the client and update Supabase.

### Steps

1. **Google Cloud Console** → APIs & Services → Credentials → Create
   **OAuth client ID** (Web application).
2. Under **Authorized redirect URIs**, add exactly:
   ```
   https://rtyyywzpdoroqouvskop.supabase.co/auth/v1/callback
   ```
3. Copy the new **Client ID** and **Client secret**.
4. **Supabase Dashboard** → Authentication → Providers → Google:
   - Enable Google
   - Paste the new Client ID and Client secret
   - Save
5. Optionally set authorized JavaScript origins in Google Cloud to
   `https://jt-devstudio.tech` and `http://localhost:3000`.
6. Smoke-test: Sign in with Google on production, then confirm GitHub still works.

## GitHub OAuth (do not regress)

GitHub uses the same app callback path. In the GitHub OAuth App settings:

- **Homepage URL:** `https://jt-devstudio.tech`
- **Authorization callback URL:**
  `https://rtyyywzpdoroqouvskop.supabase.co/auth/v1/callback`

After any Google credential change, click **Sign in with GitHub** once to
confirm it still completes through `/auth/callback`.

## Password reset email (manual check)

Code path: `/forgot-password` → `resetPasswordForEmail` → email link →
`/auth/callback?next=/reset-password` → `/reset-password`.

Delivery depends on Supabase Auth email / custom SMTP being enabled and the
Redirect URLs allow list above. Always verify with a real inbox (including spam)
after deploy — do not treat "code looks correct" as "email arrived".
