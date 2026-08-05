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

// Update DOM elements when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
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
      // Re-use the existing logic! Treats 5 mins of reading as a 100% test.
      StreakManager.recordTestCompletion('5-Min Study Session', 100);
      
      // Optional: Give them a little popup so they know they hit the goal
      alert('🔥 5 minutes of studying completed! Your daily streak has been updated.');
    }
  }
}, 300000); // 300,000 milliseconds = exactly 5 minutes
