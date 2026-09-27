# Ibnidrees Educational Services — Clickable Prototype

A frontend-only prototype of the online tutoring platform, built to show the
client and collect real reactions before writing any backend code. Plain
HTML/CSS/JavaScript, no frameworks, no build step — matches the stack you
already chose for the real product.

## Running it

Any static file server works. From this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly by
double-clicking won't work — the browser blocks the script files from
loading over the `file://` protocol. A local server, or deploying to
Netlify/Vercel/GitHub Pages, works fine.)

Deploying: this is a plain static site, so Netlify or Vercel need zero
configuration — no build command, no framework preset. Just point either
one at this folder.

## What's real vs. mocked

- **Real:** the full click-through flow, the 4-step enrolment wizard, form
  validation, the admin approve/decline workflow, tutors posting homework —
  all backed by `localStorage` so it persists across a page refresh.
- **Mocked:** there's no real sign-in. `/portal` is a "pick a role to
  preview" screen (Family / Tutor / Admin) instead of a login form — that's
  intentional, so the prototype could be built fast enough to react to.
  "Join live class" and recorded lessons are placeholder cards/modals, not
  real Zoom links or YouTube embeds.
- Data resets if you clear your browser's site data. There's no shared
  server, so what one visitor does in the demo isn't visible to another.

## Where the 3 decisions landed

- **Accounts:** family-linked — one guardian account holds one or more
  student profiles (see the Family dashboard).
- **Live classes:** external link (Zoom/Meet) for live sessions; recorded
  lessons sourced from YouTube.
- **Payments:** manual — bank transfer, confirmed over WhatsApp (see the
  enrolment confirmation screen).

## Structure

```
index.html            shell: header, footer, router mount point
styles.css             design system (navy/gold, matches the flyer)
js/data.js             mock "database" — swap this for real API calls later
js/utils.js            formatting, icons, WhatsApp link builder, modal helper
js/router.js           minimal hash router
js/pages-public.js     Home, Subjects, Enrol wizard, Portal picker
js/pages-portal.js     Family, Tutor, and Admin dashboards
js/app.js              route registration + nav wiring
```

## Suggested next step

Show this to the client, note what they react to (keep/cut/change), then
build the Flask + MySQL backend against the validated scope — `data.js` is
deliberately the only file that touches storage, so it's the one file that
needs to be replaced with real API calls; every page already expects the
same function signatures (`DATA.getSubjects()`, `DATA.submitEnrollment()`,
etc.).
