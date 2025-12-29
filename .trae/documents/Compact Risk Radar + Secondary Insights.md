**Recommendation**

* Do both: tighten whitespace for higher information density and add one small, high‑value secondary graphic to each radar column. This preserves clarity while elevating situational awareness without visual overload.

**Layout Tightening (All 3 Columns)**

* Reduce container padding: header p-4 → p-3, body p-6 → p-3.

* Shrink typography: titles text-lg → text-base; body text-sm; badges text-\[10px] unchanged.

* Compact spacing: gap-6 → gap-4; list item p-3 → p-2.

* Limit card height growth: remove flex-1 on inner wrappers; allow content to size naturally.

* Keep borders but lighten: border-stone-100; maintain strong color signal.

**Compliance Watchdog (Column 1)**

* Minor density tune only (no second graphic). Rationale: checklist items are already visually dense and actionable.

* Add “View All” button as text-only link (no extra padding).

**Sentiment Radar (Column 2) – Secondary Graphic**

* Add Hostility Trend sparkline (last 7 days) below the gauge:

  * Simple inline bar/sparkline built with divs; no chart library.

  * Data source: derive a daily hostility score from INCOMING\_EMAILS classified as risky/hostile.

* Add Trigger Sources micro‑bars (top 3 senders or tags driving hostility) next to the sparkline.

* Keep main gauge; reduce its vertical footprint.

**Iron Key (Column 3) – Secondary Graphic**

* Add Heartbeat Timeline mini‑strip (last 7 events: Verified/Sent) under countdown.

* Add Warning Ladder badges (7‑day, 3‑day, Day‑of) with estimated dates based on fallback target date.

* Ensure countdown numbers are explicitly styled (text-white) and padded (HH, MM → 2 digits) with robust cascade: mins→hours→days.

**Data & Logic**

* Sentiment: compute simple scores from INCOMING\_EMAILS (e.g., +2 for hostile keyword matches, +1 for caution) grouped by day.

* Trigger Sources: aggregate by sender/tag to top contributors.

* Iron Key: use existing SuccessionProtocol warningConfig; when absent, default target date = today + 30 days; precompute schedule dates.

**Implementation Scope**

* File updates: [CommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/CommandCenter.jsx).

* No new dependencies; pure Tailwind/utility divs.

* Keep deep‑link behaviour for spotlight: compliance items → /compliance?highlight={id}; hostile correspondence → /inbox?highlight=hostile.

**Verification**

* Build and smoke test: no white screen on Watchdog clicks, sidebar intact.

* Check density on desktop and laptop widths; ensure cards remain readable.

* Validate countdown cascade updates, and mini‑graphics render with mock data.

**If you approve**

* I will implement the compact paddings/font sizes and add the two secondary graphics as described, ensuring zero new libraries and keeping performance and clarity prioritized.

