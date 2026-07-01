# Three Lines

A Scripture study tool for reading the Bible passage by passage through six analytical lenses (or add your own).

Live at **[three-lines-sepia.vercel.app](https://three-lines-sepia.vercel.app)**

---

## The six lines

Each passage has six lines to write in. You don't have to fill every line -- just the ones that are useful to you.

| Line | What it's for |
|---|---|
| What happens | Observe the scene without interpreting it |
| How people respond | Characters' reactions: faith, confusion, hostility, wonder, silence |
| My thoughts | Personal response, questions, things that surprise or trouble you |
| Historical context | World behind the text: circumstances, authorship, original audience |
| Literary observation | World within the text: structure, tone, imagery, genre |
| Connections to other texts | Parallel accounts, earlier Scripture, cross-cultural motifs |

The name comes from [Rev. Dr. Earl Palmer](https://en.wikipedia.org/wiki/Earl_Palmer)'s three-line note-taking method. The additional lenses draw from Bart Ehrman's *The New Testament: A Historical Introduction to the Early Christian Writings*.

---

## Running locally

**1. Install Node.js**

Download the LTS version from [nodejs.org](https://nodejs.org)

**2. Install dependencies**
```bash
npm install
```

**3. Set up Supabase**
- Create a free project at [supabase.com](https://supabase.com)
- In the SQL Editor, paste and run `supabase-schema.sql`
- Go to Settings > API and copy your Project URL, anon key, and service role key

**4. Set up Bible text providers**
- ESV API key from [api.esv.org](https://api.esv.org) (used for ESV passages)
- API.Bible key from [scripture.api.bible](https://scripture.api.bible) (used for non-ESV translations)

**5. Set up Resend (contact form emails)**
- Create a free account at [resend.com](https://resend.com) and create an API key

**6. Set up Google Sheets logging (optional)**
- Create a service account at [console.cloud.google.com](https://console.cloud.google.com) > IAM > Service Accounts > Keys > Add Key (JSON)
- Enable the Google Sheets API on the same project
- Share your spreadsheet with the service account email as Editor
- Create two tabs in the spreadsheet named exactly `Feedback` and `Visits`

**7. Add environment variables**
```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `ESV_API_KEY` | ESV API key |
| `BIBLE_API_KEY` | API.Bible key |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_SITE_URL` | Optional; defaults to `https://three-lines-sepia.vercel.app` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON key (one line) for Sheets logging |

**8. Run**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Import it at [vercel.com](https://vercel.com)
3. Add the same environment variables under Settings > Environment Variables (set `NEXT_PUBLIC_SITE_URL` to your deployed URL; paste `GOOGLE_SERVICE_ACCOUNT_JSON` as a single line with no surrounding quotes)
4. Deploy

---

## Database schema

`supabase-schema.sql` creates three tables:

- `profiles` -- created automatically when a user signs up
- `notes` -- one row per user per passage per track; `is_public` controls community visibility
- `comments` -- community notes and threaded replies

Run the full schema file once in the Supabase SQL Editor when setting up a new project.

---

## Stack

- **Next.js 14** -- React framework, routing, and API routes
- **Tailwind CSS** -- styling
- **Supabase** -- auth (Google + magic link) and PostgreSQL database
- **Resend** -- contact form emails
- **Google Sheets** -- feedback and visit logging via service account
- **Vercel** -- hosting

---

Built by [itang1](https://github.com/itang1).
