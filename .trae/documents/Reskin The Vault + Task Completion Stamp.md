**Scope & Goals**
- Transform The Vault into a Safe-themed grid with high-value Asset Cards
- Add a liability “Stamp” animation on task completion in the Compliance Roadmap

**Files to Update**
- Vault grid: [TheVault.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/TheVault.jsx)
- Task stamp: [TaskCard.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/components/tasks/TaskCard.jsx) and [TaskCommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/components/tasks/TaskCommandCenter.jsx)
- Optional shared styles: Global classes in [GlobalStyles](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/components/GlobalStyles.jsx)

**1) Reskin “The Vault” to Grid Asset Cards**
- Default Grid View: Replace the current table with a responsive grid (e.g., grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
- Asset Card Visuals:
  - Card surface: white with crisp borders; slight inner “safe” emboss (shadow-sm + inset strip)
  - Top “Metal/Gold” gradient bar: 4–6px high div at card top using linear-gradient (#e7e0c4 → #b79e56)
  - Metadata stack: filename (bold, serif), trust name (uppercase small), date (mono small)
  - Action footer: “Open Archive” button, right-aligned
- Iconography Logic:
  - public ⇒ Shield icon (safe to share)
  - privileged ⇒ Lock icon (restricted)
  - admin_work_product ⇒ Wax Seal motif (no native icon: render a small red circular badge with subtle gloss and the word “SEAL” or a seal glyph)
- Hover/Focus: subtle lift (hover:shadow-md) and outline (ring-1 ring-stone-200)
- Implementation steps:
  - Map DOCUMENTS to cards; choose icon by doc.type/subtype
  - Add gradient strip at top via inline style or a utility class (e.g., bg-gradient-to-r with custom colors)
  - Ensure viewDoc path still works (DocViewer remains)

**2) Liability “Stamp” Animation on Task Completion**
- User Flow:
  - Clicking “Complete” triggers a visible ink stamp (“COMPLETED” or “FILED”) that slams onto the card
  - Pause 1.5s for user feedback, then fade the card out and remove
- Visuals:
  - Stamp: semi-transparent red or green ink (#b91c1c or #047857), uppercase text, rotated ~ -8°, drop-shadow, slightly distressed opacity (0.85)
  - Slam motion: scale(1.25) → scale(1.0), quick ease-out; add sound-ready hook (future)
  - Fade out: transition opacity to 0 and collapse height
- Implementation steps:
  - In TaskCard.jsx:
    - Add local state: stamping, stampedText (“COMPLETED” or “FILED” based on column/task type)
    - On Complete click: set stamping=true, start 1.5s timer
    - Render an absolutely-positioned stamp overlay within the card when stamping=true
    - After 1.5s: call onMove(task.id, 'done') and set a hidden flag to fade out (e.g., apply opacity-0 h-0 pointer-events-none)
  - In TaskCommandCenter.jsx:
    - Optionally delay removal by filtering tasks after animation completes (or rely on hidden flag)
  - Add keyframes:
    - @keyframes stampSlam: from { transform: scale(1.25) rotate(-8deg); opacity: 0.8 } to { transform: scale(1.0) rotate(-8deg); opacity: 0.85 }
    - Apply via className or a small CSS block in GlobalStyles

**3) Style/Utility Additions**
- Define reusable classes:
  - .metal-bar (gradient bar)
  - .stamp-overlay (position, rotation, font, color)
  - .animate-stamp-slam (keyframes)
  - .fade-out (opacity transition)

**Verification**
- Open The Vault: verify grid renders, icons match types, gradient bars display, “View Archive” works
- Complete a task in Compliance Roadmap: stamp appears, 1.5s pause, then the card fades and is removed; ensure no white-screen or click-through issues
- Cross-browser check (Chrome/Edge): animations and gradients render

**Notes**
- We’ll avoid new libraries; use existing lucide-react icons and Tailwind utilities
- Wax seal effect implemented as a custom badge (consistent with theme)

If approved, I will implement the grid reskin and the stamp animation with the above approach and verify both interactions end-to-end.