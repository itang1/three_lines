# Future Improvements

## P1 — Before sharing widely

**feat(seo): the site is effectively invisible to search and unshareable on social**
No favicon, no `robots.txt`, no `sitemap.xml`, no Open Graph or Twitter card tags, no `metadataBase`. Every page shares the single title "Three Lines" because the content pages are `'use client'` and can't export `metadata`. To fix:
- Add `metadataBase` + default `openGraph` / `twitter` blocks in `app/layout.tsx` plus an OG image (a shared `/notebook/john/1` link currently previews as a blank card).
- Give each page its own title/description. Split client pages: keep a server `page.tsx` that exports `metadata` and renders a client child for the interactive part.
- Add `app/robots.ts`, `app/sitemap.ts`, and `app/icon.png`.
- "Earl Palmer three lines method" is a low-competition term this site could own.

Update the README
Ask claude opus to do one more review
---

## Community

**feat(community): filter community notes by book/chapter**
A way to browse all community notes across the whole Bible, not just the chapter you are currently reading.

**feat(community): most discussed passages**
A page or sidebar widget showing which passages have the most community notes or replies. `SELECT passage_ref, COUNT(*) FROM notes WHERE is_public = true GROUP BY passage_ref ORDER BY COUNT DESC`.

**feat(community): moderation tools**
A flag/report button on community notes. An admin view to review flagged notes and remove them.

---

## iOS

**feat(mobile): Progressive Web App (PWA) — recommended first step**
Add a manifest file and service worker to the existing Next.js app. Users can "Add to Home Screen" on iPhone — full screen, icon on the home screen, no browser chrome. Does not appear in the App Store. Shares 100% of the existing codebase. Roughly one day of work.

**feat(mobile): Capacitor wrapper**
Wraps the existing Next.js app in a native shell with minimal code changes. Gets into the App Store faster than React Native. More "wrapped web app" than true native, but appropriate for a reading and note-taking tool.

**feat(mobile): React Native with Expo**
Rewrites the UI layer in React Native while reusing all Supabase backend logic. True native iOS app. Realistically a few months of work to reach feature parity.

---

## User Feedback Questions

Questions to ask when soliciting feedback from early users.

**Passages and chunking**
- Do the passage chunks feel like natural units, or do they cut off at awkward places?
- Is each chunk the right length — long enough to have something to say, short enough to write about on three lines?
- Are the pericope names (e.g. "The Wedding at Cana") helpful or distracting?

**The lines**
- Are the six line labels self-explanatory, or did any of them confuse you?
- Did you find yourself wanting a line that doesn't exist?
- Did any of the lines feel redundant or unnecessary?
- Did you use the optional lines (Historical context, Literary observation, Connections to other texts), or did you stick to the core three?
- Did toggling lines on and off feel useful, or would you rather just always see all six?

**Navigation**
- Could you find your way around the book easily?
- Was the sidebar chapter list helpful? Did the subtitles tell you anything useful?
- Did the progress dots (filled when you have written notes) help orient you?

**Community mode**
- Did you look at other people's notes? Was it useful or distracting?
- Did the track filter help you find what you were looking for?
- Did you feel like replying to anyone's note? If not, why not?
- Did seeing other people's notes influence what you wrote in your own?

**Saving and accounts**
- Did your notes save correctly across sessions?
- Was sign-in easy enough?
- Did you feel comfortable knowing your notes are visible to others by default?

**Overall**
- What did you do first when you opened the app?
- Was there anything you expected to find that wasn't there?
- Was there anything you found that you didn't expect?
- Would you use this for a personal Bible study? Why or why not?
- Would you use this in a group setting?
