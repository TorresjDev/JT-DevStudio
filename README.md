# JT Dev Studio

**Just Technology Development Studio** — building tools, apps, and experiences that solve real problems.

**Live:** [jt-devstudio.tech](https://jt-devstudio.tech)
**Owner:** Jesus Torres (JT)
**Stack:** Next.js · React · TypeScript · Tailwind CSS · Supabase

---

## What This Is

JT Dev Studio is not a personal blog or a resume site. It is a working studio platform that:

- Offers freelance web development and tech services to clients
- Showcases original software products and builds in progress
- Serves as a launchpad for independent revenue streams (SaaS, tools, games)
- Hosts a standalone professional profile page for job applications

---

## Site Structure

| Route | Purpose |
|---|---|
| `/` | Studio front page — services snapshot, featured builds, CTA |
| `/services` | Client-facing services and pricing |
| `/profile` | Portfolio and hire-me page for job applications |
| `/studio` | Original builds and products showcase |
| `/contact` | Client intake form |
| `/posts` | Blog and post feed |
| `/support` | Support the studio (Stripe + crypto donations) |
| `/ai-tools` | Experimental AI tools |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| UI Components | shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (GitHub, Google, Email) |
| Email | Resend |
| Payments | Stripe, Coinbase Commerce |
| Rate Limiting | Upstash Redis |
| Editor | TipTap (ProseMirror) |
| Validation | Zod |
| Testing | Vitest |
| Deployment | Vercel |

---

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Stripe account (test keys are fine)
- A Resend account

### Setup

```bash
git clone https://github.com/TorresjDev/Nextjs-App.git
cd Nextjs-App
npm install
```

Copy the environment variable template and fill in your values:

```bash
cp .env.example .env.local
```

### Required Environment Variables

```env
# App
SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# GitHub (for /about and /profile)
NEXT_GITHUB_USERNAME=

# Resend (contact form email)
RESEND_API_KEY=

# Stripe (donations)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Coinbase Commerce (crypto donations)
COINBASE_API_KEY=
COINBASE_WEBHOOK_SECRET=

# Upstash Redis (rate limiting — optional)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Database

Run the migration in your Supabase project's SQL editor:

```
supabase/migrations/001_ugc_schema.sql
```

Create a private storage bucket named `ugc-media` in your Supabase project.

### Run

```bash
npm run dev
# http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |
| `npm run test:coverage` | Test coverage report |

---

## Security

See [SECURITY.md](SECURITY.md) for the security policy and how to report vulnerabilities.

---

## About the Name

**JT** stands for **Just Technology**. It is intentional — humble, professional, and direct. When people ask what JT stands for, the answer is: Just Technology.

---

*Built and maintained by Jesus Torres — [jt-devstudio.tech](https://jt-devstudio.tech)*
