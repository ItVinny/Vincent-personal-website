# Vincent Omolo Portfolio — Admin System

This is stage one of the full-stack rebuild: **Prisma schema, authentication,
and the protected admin shell**. The public-facing homepage still needs to
be migrated from the static HTML/CSS/JS version to pull from this database
— that's the next build step, along with the content editing forms, media
library, and analytics dashboard described in the original brief.

## What's built so far

- `prisma/schema.prisma` — full schema: User, HeroSection, AboutSection,
  FooterContent, Project, Service, JournalPost, Media, AnalyticsEvent
- `prisma/seed.ts` — creates the admin user and seeds content matching the
  current static site, so nothing changes visually on first load
- `lib/auth.ts` — NextAuth (Auth.js) v5 with a Credentials provider,
  single admin account only, no sign-up flow
- `middleware.ts` — blocks every `/admin/*` route except `/admin/login`
  unless there's a valid session
- `app/admin/login` — minimal Apple-styled login page
- `app/admin/(dashboard)` — protected layout with sidebar (Dashboard,
  Content, Media, Analytics, Settings) and a placeholder dashboard page
  showing live counts from the database

## Running this locally

You'll need Node.js 18.18+ and a terminal. This will not run inside
Codepen or a browser-only tool — it's a real server application.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get a free Postgres database.** Either works well for this project:
   - [Neon](https://neon.tech) — serverless Postgres, generous free tier
   - [Supabase](https://supabase.com) — Postgres + extras, free tier

   Copy the connection string it gives you.

3. **Set up your environment file**
   ```bash
   cp .env.example .env
   ```
   Fill in:
   - `DATABASE_URL` — the connection string from step 2
   - `NEXTAUTH_SECRET` — generate with `npx auth secret`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your login credentials (change
     the password to something real before seeding)

4. **Create the database tables**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the admin user and starter content**
   ```bash
   npx prisma db seed
   ```

6. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/admin/login` and sign in with the
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.

## Deploying (once the public site is wired to the database)

1. Push this project to a GitHub repository.
2. Import it into [Vercel](https://vercel.com) (free tier is fine to start).
3. Add the same environment variables from `.env` in the Vercel project
   settings (use your production database URL, and generate a fresh
   `NEXTAUTH_SECRET`).
4. Set `NEXTAUTH_URL` to your live domain (e.g. `https://vincentomolo.com`).
5. Deploy. Vercel runs `prisma generate` automatically via the
   `postinstall` script in `package.json` — you'll still need to run
   `npx prisma migrate deploy` once against the production database
   (Vercel's CLI or a one-off script both work) before the app can read
   or write content.

Image uploads (UploadThing) and the analytics dashboard aren't wired up
yet — those need their own environment variables and setup steps, which
I'll add when we build those pieces.

## A note on running this without a local setup

