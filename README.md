# Study Hub

A private, multi-subject study reviewer site — Economics (AP), Geometry (Math), and Philippine Literature (FIL) — served as static HTML pages from a single hub, deployed on GitHub Pages, and gated behind a password so only people you share the password with can access it.

---

## 📁 Project structure

```
StudyGuide/
├── index.html                          # Hub homepage — links to all subject reviewers
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

Add your authentication approach here. This may be a client-side solution or integrated with your GitHub Pages deployment method.

---

## 📚 Subjects covered

- **AP**
- **FILIPINO**
- **MATHEMATICS**
- **ENGLISH**
- **TLE**
- **COMPUTER**
- **CLF**
- **PE/H**
- **SCIENCE**
- **MUSIC/ARTS**
