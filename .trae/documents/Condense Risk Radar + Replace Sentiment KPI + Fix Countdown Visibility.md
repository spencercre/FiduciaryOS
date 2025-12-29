**Scope**
- Condense Compliance Watchdog one more iteration, replace Sentiment secondary graphic with Beneficiary Hotspot Mosaic, and make Iron Key countdown numbers black and readable.

**Compliance Watchdog Ultra‑Compact**
- Header/body paddings: header p-2, items p-1, list gap-1.
- Fonts: header text-sm, item title text-xs, badges keep text-[10px].
- Row content: single-line (severity dot • title • due badge), remove secondary trust line; title shows full on tooltip.
- Optional grid: two columns for top 6 items on lg screens.

**Sentiment Radar – Beneficiary Hotspot Mosaic**
- Data: Group INCOMING_EMAILS by sender; for each sender compute count and risk (hostile if classification needs_review and sender includes key names like greg; else neutral).
- Visual: 2–3 row mosaic of small squares with sender initials, colored by risk (red/amber/green/stone). Tooltip shows full sender + count.
- Placement: under main gauge with compact spacing.

**Iron Key Countdown – Black Numbers**
- Wrap countdown numbers in a light capsule (bg-stone-100 text-black px-3 py-1 rounded) to ensure visibility over dark card.
- Ensure HH/MM padStart(2,'0') and cascade mins→hours→days; default target = today + 30 days.

**Files to Update**
- [CommandCenter.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/CommandCenter.jsx): compact Watchdog, add Hotspot Mosaic, add countdown capsule styling.
- Optional mirror in [SuccessionProtocol.jsx](file:///c:/Projects/fiduciary-operating-system/fos-prototype/src/pages/SuccessionProtocol.jsx) for consistent countdown.

**Verification**
- Build the app, ensure Watchdog rows are denser without overflow, hover shows full titles.
- Confirm Mosaic renders with initials, colors by risk, and tooltips; performance OK with mock data.
- Check countdown black numbers are readable inside the light capsule, cascade logic functions.

I will proceed with these exact changes, using only Tailwind/utility divs and current mock data, no new dependencies.