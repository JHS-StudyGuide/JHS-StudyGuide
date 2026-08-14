/* =========================================================
   UNIVERSAL PDF GENERATOR (assets/js/universal-pdf.js)
   ---------------------------------------------------------
   This script implements Method 1 (Native Print-to-PDF)
   and works universally by injecting styled components
   and print overrides automatically.
   ========================================================= */

(function () {
  // -------------------------------------------------------
  // 1. Define Component CSS (Screen + Print)
  // -------------------------------------------------------
  const styles = `
    /* Screen Styling for the Generated Button */
    .pdf-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-raised, #ffffff);
      color: var(--ink, #000000);
      border: 1px solid var(--rule, #cccccc);
      padding: 6px 12px;
      border-radius: var(--radius, 8px);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s, border-color 0.2s;
      margin-right: 8px; /* Space between PDF and Theme Toggle */
    }

    .pdf-btn:hover {
      border-color: var(--card-accent, #000000);
      background: color-mix(in srgb, var(--card-accent, #cccccc) 10%, var(--bg-raised, #fff));
    }

    /* Mobile handling for the injected button text */
    @media (max-width: 640px) {
      .pdf-text { display: none; }
      .pdf-btn { padding: 8px; gap: 0; }
    }

    /* ---------------------------------------------------
       METHOD 1: PRINT / PDF EXPORT OVERRIDES (@media print)
       --------------------------------------------------- */
    @media print {
      /* Hide navigation, sidebars, interactive tabs, and UI elements */
      nav, .sidebar, .theme-toggle, .streak-badge, .pdf-btn, .test-link, footer,
      .directory, #styleTabs, #stylePanel, header.topbar .back, header.topbar .label {
        display: none !important;
      }

      /* Force full Grid to print every item instead of just the active tab */
      .dept-grid, #styleGrid {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px !important;
      }

      /* Reset body & background for crisp black-and-white output */
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 12pt;
        margin: 0 !important;
        padding: 0 !important;
      }

      main, .content {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Clean card formatting for PDF output */
      .card, .type-card, .hero-card, .dept-card {
        border: 1px solid #cccccc !important;
        background: #ffffff !important;
        color: #000000 !important;
        box-shadow: none !important;
        break-inside: avoid; /* Prevents awkward page breaks in cards */
      }

      .dept-tag {
        color: #333333 !important;
      }

      /* Clean links */
      a {
        color: #000000 !important;
        text-decoration: none !important;
      }
    }
  `;

  // -------------------------------------------------------
  // 2. Inject Stylesheet into <head>
  // -------------------------------------------------------
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // -------------------------------------------------------
  // 3. Create Button & Inject Next to Theme Toggle
  // -------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Find the existing theme toggle button (by ID or class)
    const themeToggle = document.getElementById('themeToggle');
    
    // Ensure the toggle exists and we haven't added the PDF button already
    if (themeToggle && !document.querySelector('.pdf-btn')) {
      const btn = document.createElement('button');
      btn.className = 'pdf-btn';
      btn.title = 'Download / Print PDF';
      
      // Native window.print() handles SAVE-AS-PDF dialog
      btn.setAttribute('onclick', 'window.print()');
      
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span class="pdf-text">PDF</span>
      `;
      
      // INSERTING PLACEMENT: Place next to (immediately before) theme toggle
      themeToggle.before(btn);
    }
  });
})();