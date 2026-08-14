/* ==========================================================================
   Streak Manager & Display Logic
   ========================================================================== */

const StreakManager = (() => {
  const STORAGE_KEY = 'studyStreak';

  // Fetch current streak data from localStorage
  const getStreak = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      current: 0,
      longestStreak: 0,
      lastTestedDate: null,
      completedTests: [],
    };
    return data;
  };

  // Call this when a test/quiz is completed successfully
  const recordTestCompletion = (subject, score) => {
    const data = getStreak();
    const today = new Date().toDateString();

    // Check if a test was already completed today
    const testedToday = data.completedTests.some(
      (test) => test.date === today
    );

    // Record test entry
    data.completedTests.push({
      date: today,
      subject: subject,
      score: score,
      timestamp: Date.now(),
    });

    // Only update streak count on the first test of the day
    if (!testedToday) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (data.lastTestedDate === yesterday) {
        data.current++; // Continued streak from yesterday
      } else if (data.lastTestedDate !== null) {
        data.current = 1; // Missed a day -> reset streak
      } else {
        data.current = 1; // First test ever
      }

      data.lastTestedDate = today;
      data.longestStreak = Math.max(data.current, data.longestStreak);
    }

    // Keep last 90 days of history to prevent localStorage bloat
    const ninetyDaysAgo = Date.now() - 90 * 86400000;
    data.completedTests = data.completedTests.filter(
      (test) => test.timestamp > ninetyDaysAgo
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Instantly refresh UI badge if it exists on the page
    updateStreakDisplay(data);

    return data;
  };

  return { getStreak, recordTestCompletion };
})();

// Auto-inject adaptive CSS styles so you don't need to manually paste CSS in every stylesheet
function injectStreakStyles() {
  if (document.getElementById('streak-styles')) return;
  const style = document.createElement('style');
  style.id = 'streak-styles';
  style.textContent = `
    .streak-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px;
      background: var(--bg-raised, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--rule, rgba(255, 255, 255, 0.15));
      border-radius: var(--radius, 99px);
      font-size: 0.85rem; font-weight: 600; color: var(--ink, #ffffff);
      box-shadow: 0 1px 3px var(--shadow, rgba(0, 0, 0, 0.2));
      transition: transform 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
      user-select: none; cursor: default; white-space: nowrap;
    }
    .streak-badge:hover { border-color: var(--card-accent, #ff7700); transform: translateY(-1px); }
    .streak-emoji { font-size: 1rem; line-height: 1; filter: drop-shadow(0 0 2px rgba(255, 165, 0, 0.4)); }
    .streak-count { font-weight: 700; color: var(--steel, var(--card-accent, #fff200))); font-variant-numeric: tabular-nums; }
    .streak-label { font-size: 0.78rem; color: var(--ink-secondary, #94a3b8); font-weight: 500; }
    @media (max-width: 640px) {
      .streak-badge { padding: 4px 8px; gap: 4px; font-size: 0.8rem; }
      .streak-label { display: none; }
    }
  `;
  document.head.appendChild(style);
}

// Update DOM elements when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
  injectStreakStyles();
  if (typeof StreakManager !== 'undefined') {
    const streak = StreakManager.getStreak();
    updateStreakDisplay(streak);
  }
});

// Render the streak count and emoji in the header badge
function updateStreakDisplay(streak) {
  const badge = document.getElementById('streak-badge');
  const countEl = document.getElementById('streak-count');
  const emojiEl = document.getElementById('streak-emoji');

  if (!badge || !countEl || !emojiEl) return;

  countEl.textContent = streak.current;

  // Milestone emojis based on current streak days
  if (streak.current >= 30) {
    emojiEl.textContent = '👑';
  } else if (streak.current >= 7) {
    emojiEl.textContent = '🌟';
  } else {
    emojiEl.textContent = '🔥';
  }

  // Slightly dim the badge if they haven't started a streak yet
  if (streak.current === 0) {
    badge.style.opacity = '0.75';
  } else {
    badge.style.opacity = '1';
  }
}

// ==========================================================================
// Time-Based Streak (5 Continuous Minutes)
// ==========================================================================

setTimeout(() => {
  if (typeof StreakManager !== 'undefined') {
    const streak = StreakManager.getStreak();
    const today = new Date().toDateString();
    
    // Only fire if they haven't already earned a streak today
    const testedToday = streak.completedTests.some(t => t.date === today);
    
    if (!testedToday) {
      // Re-use existing logic: treats 5 mins of reading as a 100% test.
      StreakManager.recordTestCompletion('5-Min Study Session', 100);
      alert('🔥 5 minutes of studying completed! Your daily streak has been updated.');
    }
  }
}, 300000); // 300,000 milliseconds = 5 minutes