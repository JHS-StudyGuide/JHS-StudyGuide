# Study Hub

A private, multi-subject study reviewer site — Math, AP, Filipino, Science, TLE, English, CLF, PE/H, M/A, Computer — served as static HTML pages from a single hub, deployed on GitHub Pages, **AND** *(soon to be gated behind a password so only people you share the password with can access it)*

---

## 📁 Project structure

```
StudyGuide/
├── index.html                          # Hub homepage — links to all subject reviewers
├── style.css                           # Hub-only styles
├── README.md
├── assets/
│   ├── bg-dark.png
│   ├── bg-light.png
│   ├── data/
│   │   └── subjects.json               # Sidebar content — edit this to add/change lessons
│   └── js/
│       └── sidebar.js                  # Renders the sidebar from subjects.json
└── studyguide-subjects/
    ├── past-lessons-coming-soon.html   # Placeholder for topics without notes yet
    ├── AP/
    │   ├── Economics__AP_.html
    │   └── Economics_AP.css
    ├── ENG/
    │   ├── Rhyme-Characterization-English.html
    │   └── Rhyme-Characterization-English.css
    ├── FIL/
    │   ├── Philippine_Literature__FIL_.html
    │   └── Philippine_Literature_FIL.css
    ├── MATH/
    │   ├── Geometry__Math_.html
    │   ├── Geometry_Math.css
    │   ├── Polygon-Angles.html
    │   └── Polygon-Angles.css
    ├── SCI/
    │   ├── Lab-apparatus-sci.html
    │   └── Lab-apparatus-sci.css
    └── TLE/
        ├── Front-Desk-Department.html
        ├── Front-Desk-Department.css
        ├── Hotel-Services.html
        └── Hotel-Services.css
```

Each subject page is a standalone HTML reviewer with its own CSS file, grouped by subject folder. The hub (`index.html`) links to all of them and also renders the "Past Lessons" sidebar dynamically.

**Adding a new lesson link:** don't edit `index.html`. Add an entry to `assets/data/subjects.json` (under the relevant subject → module → lessons array) and the sidebar picks it up automatically — numbering, structure, and accent colors are generated for you.

---

## ✨ Features

- **Mobile Support** — Mobile Support for most phones so you can access notes on the go.
- **Responsive layout** — nav becomes a horizontally scrollable strip on narrow screens, tables scroll independently instead of squeezing the page, and the demo/interactive elements stack vertically on mobile.
- **Interactive elements** — e.g. the Economics page includes a slider-based demo of the classroom "allocation problem."
- **Central hub** — one entry point (`index.html`) instead of separate bookmarks per subject.

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

---

## 🛠️ COMING SOON


**🔒 Access control (password gate)**

Add your authentication approach here. This may be a client-side solution or integrated with your GitHub Pages deployment method.

---
