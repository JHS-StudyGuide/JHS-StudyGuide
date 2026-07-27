/**
 * Renders the "Past Lessons" sidebar from assets/data/subjects.json.
 *
 * To add/edit/remove a lesson: edit subjects.json only. Nothing here needs
 * to change for routine content updates — lesson numbers, <details> markup,
 * and module wrappers are all generated to match the original hand-written
 * structure (same classes, same accent-color mechanism) so style.css needs
 * no changes.
 */
(function () {
  const MOUNT_ID = 'sidebar-lessons';
  const DATA_URL = 'assets/data/subjects.json';

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function buildLessonItem(lesson, index) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = lesson.href;
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = pad(index + 1);
    a.appendChild(n);
    a.appendChild(document.createTextNode(' ' + lesson.label));
    li.appendChild(a);
    return li;
  }

  function buildModule(module) {
    const section = document.createElement('div');
    section.className = 'module-section';

    const title = document.createElement('div');
    title.className = 'module-title';
    title.textContent = module.title;
    section.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'lesson-list';
    module.lessons.forEach((lesson, i) => {
      ul.appendChild(buildLessonItem(lesson, i));
    });
    section.appendChild(ul);

    return section;
  }

  function buildSubject(subject) {
    const details = document.createElement('details');
    details.className = subject.accentClass
      ? `lesson-group ${subject.accentClass}`
      : 'lesson-group';
    if (subject.accentColor) {
      details.style.setProperty('--group-accent', subject.accentColor);
    }

    const summary = document.createElement('summary');
    summary.textContent = subject.label;
    details.appendChild(summary);

    subject.modules.forEach((module) => {
      details.appendChild(buildModule(module));
    });

    const viewAll = document.createElement('a');
    viewAll.className = 'view-all';
    viewAll.href = subject.viewAllHref;
    viewAll.textContent = subject.viewAllLabel;
    details.appendChild(viewAll);

    return details;
  }

  function render(data) {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;
    const frag = document.createDocumentFragment();
    data.subjects.forEach((subject) => {
      frag.appendChild(buildSubject(subject));
    });
    mount.appendChild(frag);
  }

  function renderError() {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;
    const p = document.createElement('p');
    p.className = 'sidebar-note';
    p.textContent = 'Past lessons failed to load — check assets/data/subjects.json.';
    mount.appendChild(p);
  }

  fetch(DATA_URL)
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(render)
    .catch((err) => {
      console.error('sidebar.js:', err);
      renderError();
    });
})();
