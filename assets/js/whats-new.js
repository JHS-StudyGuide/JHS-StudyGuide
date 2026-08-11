/**
 * Renders the "What's New" section from assets/data/whats-new.json.
 *
 * This is completely separate from subjects.json/sidebar.js — it doesn't
 * care about lessons, modules, or dates on lesson content. It's just a
 * manually maintained list of announcements, newest first.
 *
 * To post an update: add one entry to the "updates" array in
 * assets/data/whats-new.json:
 *
 *   { "date": "2026-08-13", "text": "Added TLE Front Desk notes", "href": "studyguide-subjects/TLE/Front-Desk-Department.html" }
 *
 * - "date"  required, format YYYY-MM-DD. Used only for sorting/display.
 * - "text"  required. The announcement text.
 * - "href"  optional. If present, the whole line becomes a link.
 *
 * To remove an old update: delete its entry from the array.
 * When the array is empty, the whole section hides itself automatically.
 */
(function () {
  const SECTION_ID = 'whats-new-section';
  const MOUNT_ID = 'whats-new-list';
  const DATA_URL = 'assets/data/whats-new.json';

  function warn(msg) {
    console.warn('[whats-new.js] ' + msg);
  }

  function isValidEntry(entry) {
    if (typeof entry.text !== 'string' || entry.text.trim() === '') {
      warn('Skipping update — missing or empty "text": ' + JSON.stringify(entry));
      return false;
    }
    if (typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date.trim())) {
      warn('Skipping update — "date" must be YYYY-MM-DD: ' + JSON.stringify(entry));
      return false;
    }
    if (entry.href !== undefined && (typeof entry.href !== 'string' || entry.href.trim() === '')) {
      warn('Update has an invalid "href", ignoring the link (text will still show): ' + JSON.stringify(entry));
    }
    return true;
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function buildItem(entry) {
    const li = document.createElement('li');
    li.className = 'whats-new-item';

    const hasLink = typeof entry.href === 'string' && entry.href.trim() !== '';
    const textEl = document.createElement(hasLink ? 'a' : 'span');
    if (hasLink) textEl.href = entry.href;
    textEl.className = 'whats-new-text';
    textEl.textContent = entry.text;

    const dateEl = document.createElement('span');
    dateEl.className = 'whats-new-date';
    dateEl.textContent = formatDate(entry.date);

    li.appendChild(textEl);
    li.appendChild(dateEl);
    return li;
  }

  function render(data) {
    const section = document.getElementById(SECTION_ID);
    const mount = document.getElementById(MOUNT_ID);
    if (!section || !mount) return;

    const updates = Array.isArray(data && data.updates) ? data.updates : [];
    const valid = updates.filter(isValidEntry);

    if (valid.length === 0) {
      section.style.display = 'none';
      return;
    }

    valid.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const ul = document.createElement('ul');
    ul.className = 'whats-new-items';
    valid.forEach((entry) => ul.appendChild(buildItem(entry)));

    mount.innerHTML = '';
    mount.appendChild(ul);
    section.style.display = '';
  }

  fetch(DATA_URL)
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(render)
    .catch((err) => {
      console.error('[whats-new.js] Failed to load whats-new.json:', err);
      const section = document.getElementById(SECTION_ID);
      if (section) section.style.display = 'none';
    });
})();
