**Changes Requested**

**Compliance Watchdog (Expand to previous density)**
- Restore paddings and font sizes to the last readable iteration:
  - Header: p-3, title text-base
  - List: p-3 body with space-y-2
  - Item rows: p-2, title text-sm, re-add "Trust #" subtitle line for context
  - Single-column list (remove lg two-column grid) to improve readability
- File to update: [CommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/CommandCenter.jsx)

**Sentiment Radar (Remove Hotspot Mosaic)**
- Remove the "Beneficiary Hotspots" mosaic block entirely
- Keep the primary gauge and the "Review Hostile Correspondence" action
- File to update: [CommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/CommandCenter.jsx)

**Iron Key Countdown (No change)**
- Keep the light capsule with black numbers as-is
- File: [CommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/CommandCenter.jsx)

**Verification**
- Build and smoke test: verify Watchdog readability, ensure mosaic removed, countdown black numbers visible
- Confirm deep-link clicks from Watchdog still route to Compliance without white screens

If approved, I will make these adjustments in CommandCenter.jsx and verify the build and interactions.