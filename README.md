# Study Hub

A private, multi-subject study reviewer site — Economics (AP), Geometry (Math), and Philippine Literature (FIL) — served as static HTML pages from a single hub, deployed on Netlify, and gated behind a password so only people you share the password with can access it.

---

## 📁 Project structure

```
StudyGuide/
├── index.html                          # Hub homepage — links to all subject reviewers
├── netlify.toml                         # Tells Netlify where the edge function lives
├── netlify/
│   └── edge-functions/
│       └── auth-gate.js                 # Password gate, runs on every request
├── README.md
└── studyguide-subjects/
    ├── Economics__AP_.html
    ├── Geometry__Math_.html
    └── Philippine_Literature__FIL_.html
```

Each subject page is a standalone, single-file HTML reviewer — no shared assets, no build step. The hub (`index.html`) is just a linking page with cards pointing to each one.

---

## ✨ Features

- **Dark mode** — toggle in the top bar, defaults to system preference, persists per page load using CSS variables (not stored across sessions).
- **Responsive layout** — nav becomes a horizontally scrollable strip on narrow screens, tables scroll independently instead of squeezing the page, and the demo/interactive elements stack vertically on mobile.
- **Interactive elements** — e.g. the Economics page includes a slider-based demo of the classroom "allocation problem."
- **Central hub** — one entry point (`index.html`) instead of separate bookmarks per subject.

---

## 🔒 Access control (password gate)

The site is restricted using a **Netlify Edge Function**, not Netlify's built-in Basic Auth — the built-in `_headers` Basic-Auth approach is now a **Pro-plan-only feature**, so it silently does nothing on the Free plan despite looking like it works.

### How it works
1. A visitor requests any page.
2. `netlify/edge-functions/auth-gate.js` runs first, before the page is served.
3. If they have a valid session cookie, the request passes through normally.
4. If not, they see a styled password form (not a plain browser popup).
5. On a correct password, a session cookie is set for **24 hours** and they're let through.
6. Visiting `/logout` clears the cookie.

### Setup
1. In Netlify: **Site configuration → Environment variables → Add a variable**
   - Key: `SITE_PASSWORD`
   - Value: whatever password you want to share with allowed users
   - **Make sure the variable's scope includes "Functions"** — edge functions won't see variables outside that scope.
2. The function reads it using `Netlify.env.get("SITE_PASSWORD")` — **not** `Deno.env.get()`, which does *not* see dashboard-set variables in edge functions.
3. Trigger a fresh deploy after adding or changing the variable — env var changes only take effect on the next deploy, not immediately.

### Rotating the password
Since this is a single shared password for everyone (not per-person accounts), you can rotate it manually for extra security:
1. Update the `SITE_PASSWORD` value in Netlify's dashboard.
2. Trigger a redeploy (**Deploys → Trigger deploy**) — no code push needed.
3. Share the new password with allowed users through a separate channel (text, chat, password manager share, etc.).

### Known limitations of this approach
- **One password for everyone** — no per-person accounts, no way to revoke a single person without changing it for all.
- **No rate limiting** — nothing stops repeated automated password guesses.
- **No audit trail** — no record of who logged in or when.
- **Session = cookie only** — anyone with a copy of a valid cookie has access until it expires or the password changes.
- Appropriate for **keeping casual/random visitors out**, not for protecting genuinely sensitive data.

---

## 🌐 Deployment (Netlify)

1. Push this repo to GitHub.
2. Connect the repo in Netlify.
3. Set the **Publish directory** to the folder containing `index.html` (repo root, in this setup).
4. Add the `SITE_PASSWORD` environment variable (see above).
5. Deploy.

### Linking subject pages
Pages are linked with plain relative paths — no routing config needed:
```html
<a href="studyguide-subjects/Economics__AP_.html">Economics Reviewer</a>
```
As long as all files are deployed together in the same folder structure, these links resolve correctly.

---

## 💳 Netlify Free plan usage notes

Netlify's Free plan runs on a **monthly credit allotment** (300 credits/month), not unlimited hosting:

| Action | Cost |
|---|---|
| Successful production deploy | 15 credits |
| Web requests | 2 credits per 10,000 requests |
| Function/compute usage | 10 credits per GB-hour |

When credits run out, **all projects on the account pause** until the next billing cycle — visitors see a "Site not available" page. Frequent redeploys (e.g. daily password rotation) and high traffic both count against this pool, so it's worth checking **Site → Usage** in the dashboard occasionally if credits are running low.

---

## 🐞 Troubleshooting notes (from setup)

- **"Page Not Found" after an edit that looks fine on GitHub** → usually a stale browser cache, not a real deploy issue. Hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) or test in an incognito window before assuming something broke.
- **"Site is not yet configured" message** → `SITE_PASSWORD` isn't set, isn't scoped to Functions, or hasn't been picked up by a redeploy yet.
- **"Edge function has crashed"** → check **Site → Logs → Edge functions** in the dashboard for the actual stack trace; the generic error message on-screen doesn't show the real cause.
- **Basic-Auth via `_headers` doing nothing** → this feature now requires a Pro plan; Netlify still reports "header rules processed" even when it can't apply them on Free.

---

## 📚 Subjects covered

- **Economics (AP)** — Allocation, the three fundamental economic questions, types of products, economic systems, and the historical theories (feudalism, mercantilism, physiocrats, classical, neoclassical, Keynesian) that shaped them.
- **Geometry (Math)** — Segments, betweenness, midpoints, and the Segment Addition Postulate.
- **Philippine Literature (FIL)** — A timeline of Philippine literary periods.
