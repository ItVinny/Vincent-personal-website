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

## Setting up image uploads (UploadThing)

1. Go to [uploadthing.com](https://uploadthing.com) and sign up (free tier
   is enough for this project).
2. Create a new app from their dashboard.
3. Find your API token — usually under the app's "API Keys" section —
   and copy it.
4. In `.env`, set `UPLOADTHING_TOKEN` to that value. Do the same in
   Vercel's Environment Variables for your production deployment.
5. Restart your dev server (`npm run dev`) if it was already running.
6. Visit `/admin/media` and try uploading an image — if it fails,
   double check the token was copied without extra spaces.

Once an image is uploaded, go to any content editor (Hero, About, a
specific Project, or a Journal post) and use "Choose from library" to
attach it — that's what actually replaces the gradient placeholder on
your live homepage.

## Analytics

No third-party service needed — pageviews and section views are tracked
directly into your own database (the `AnalyticsEvent` table), and the
`/admin/analytics` dashboard reads straight from it. A small tracking
component on the homepage and journal article pages fires one event per
visit; nothing is tracked on `/admin` pages themselves. It needs no setup
beyond what's already running, but won't show anything until your live
site actually gets some visits.

## Final touches: favicon, inquiry form, contact icons, centered footer

**Favicon** — `app/icon.png` and `app/apple-icon.png` are your logo.
Next.js auto-detects these and injects the right `<link>` tags itself;
nothing else to configure.

**Inquiry form emails (Gmail)**

1. Turn on 2-Step Verification on the Google account for
   `vingoldearn@gmail.com`, if it isn't already (myaccount.google.com →
   Security).
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   and create a new App Password (name it something like "Portfolio
   site").
3. Copy the 16-character password it gives you (shown with spaces,
   like `abcd efgh ijkl mnop` — you can paste it with or without the
   spaces).
4. Set `GMAIL_USER="vingoldearn@gmail.com"` and
   `GMAIL_APP_PASSWORD="that 16-character password"` in `.env`, and
   the same two values in Vercel's Environment Variables.
5. The inquiry form at the bottom of your homepage now emails you
   directly, with the visitor's email set as "Reply-To" so you can
   just hit reply.

**Contact icons (WhatsApp / Telegram / LinkedIn)** — these pull from
new fields on your Footer content. Go to `/admin/content/footer` and
fill in:
- WhatsApp: your number with country code, digits only (e.g.
  `254712345678`, no `+` or spaces)
- Telegram: your username, without the `@`
- LinkedIn: your full profile URL (same field as before)

Each icon only appears once its field has something in it — nothing
shows as a dead link in the meantime.

**New database columns** — this update added `whatsapp` and `telegram`
to the `FooterContent` table, which means a real schema migration is
needed (the first one since you went live). Run this locally, then
push the generated migration file:
```
npx prisma migrate dev --name add_whatsapp_telegram
```
Commit the new file it creates under `prisma/migrations/`, push, and
then run `npx prisma migrate deploy` once against your production
database (same as the one-time step from initial deployment) so
Vercel's database has the new columns too.

**Centered footer** — the footer is now a single centered column
(logo, tagline, nav links, contact icons, copyright) instead of the
previous spread-out multi-column layout.

## Settings

`/admin/settings` currently handles one thing: changing the admin
password. The account itself is still the single one created by the
seed script — there's no multi-user support.

## A note on running this without a local setup

If installing Node.js and a terminal workflow feels like a lot, **Claude
Code** (Anthropic's coding tool) can run this project for you end to end —
install dependencies, set up the database, and walk through deployment —
without you needing to memorize commands.
