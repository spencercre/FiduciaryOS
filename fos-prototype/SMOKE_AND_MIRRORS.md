# FOS: Front-End Simulations (Smoke & Mirrors)

> **Purpose:** This file tracks all features that appear functional in the UI but are front-end only. 
> No backend logic exists for these features yet. Use this as a punch list when building production infrastructure.
>
> **Code Convention:** All simulated features in `App.jsx` are tagged with `// SMOKE_AND_MIRRORS:` comments.

---

## 1. Dead Man's Switch Warning System

### What the UI Shows
- Configuration panel in Admin Console → Successor Vault for setting warning thresholds
- Preview of email/SMS notifications at 7-day, 3-day, and day-of triggers
- In-app notification banner simulating countdown warnings
- "Last Verification" timestamp display
- Notification history log (simulated)

### What's Actually Happening
- **Nothing.** No emails or SMS messages are sent. No background jobs are running.
- The countdown is calculated client-side from a hardcoded "last login" date
- Warning previews are static mockups
- Notification history is fake seed data

### Backend Required for Production
- [ ] User profile schema: add `phone`, `notificationPreferences`, `lastVerifiedAt` fields
- [ ] Cloud Function (Firebase) or Cron Job: daily check for inactivity threshold
- [ ] Email service integration (SendGrid, AWS SES, or similar)
- [ ] SMS service integration (Twilio or similar)
- [ ] Notification log table in Firestore
- [ ] Successor Trustee contact verification flow
- [ ] Actual "heartbeat" endpoint that resets the countdown on login

### Files Affected
- `src/App.jsx` → `DigitalSuccessor` component
- `src/App.jsx` → `AdminConsole` component (Successor Vault section)

---

## 2. Tax Nexus Activity Tracking ✅ IMPLEMENTED (Phase 1)

### What the UI Shows
- Educational overlay explaining CA tax nexus rules (expandable "Learn More" in TrustDetail)
- Activity type dropdown in Billing → Quick Entry with color-coded categories
- Visual indicator when a "caution" or "delegate" activity is selected
- Expandable "Learn More" section with nexus guidance in both locations
- Warning messages for non-safe activities

### What's Actually Happening
- Activity tags are stored in local React state only
- No persistence to database
- No cumulative tracking or risk calculation
- Educational content is static (not legally reviewed)
- `NEXUS_ACTIVITY_CATEGORIES` constant defines the three tiers

### Backend Required for Production
- [ ] Activity schema in Firestore: `{ trustId, activityType, nexusCategory, timestamp, hours }`
- [ ] Nexus calculation service: aggregate activities by category per quarter
- [ ] Legal review of activity categorizations (must be validated by tax attorney)
- [ ] Reporting: quarterly nexus exposure report per trust
- [ ] Alerts when cumulative risk exceeds threshold

### Activity Categories (DRAFT - Requires Legal Review)
| Category | Risk Level | Examples |
|----------|------------|----------|
| Safe | ✅ None | Correspondence, reviewing statements, beneficiary calls |
| Caution | ⚠️ Moderate | Investment decisions, distribution approvals, tax elections |
| Delegate | 🚫 High | Signing trust docs, real estate transactions, court appearances |

### Files Affected
- `src/App.jsx` → `NEXUS_ACTIVITY_CATEGORIES` constant
- `src/App.jsx` → `BillingModule` component (Quick Entry dropdown)
- `src/App.jsx` → `NexusWarningBanner` component
- `src/App.jsx` → `TrustDetail` component (uses NexusWarningBanner)

---

## 3. Demo Data Restore

### What the UI Shows
- "Restore Demo Data" button in Admin Console
- Success/loading states with animation

### What's Actually Happening
- Button triggers a fake 1.5-second timeout
- No actual data is written to Firestore
- Local state is not reset

### Backend Required for Production
- [ ] Firestore batch write to reset collections to seed data
- [ ] Or: Firestore Rules that protect demo data from modification
- [ ] Clear user-generated data vs. seed data distinction

### Files Affected
- `src/App.jsx` → `AdminConsole` component

---

## 4. Successor Trustee Vault

### What the UI Shows
- Editable credential fields with mask/reveal toggles
- "Save Changes" button

### What's Actually Happening
- Data is stored in local React state only
- Changes are lost on page refresh
- No encryption, no secure storage

### Backend Required for Production
- [ ] Encrypted storage (Firestore + client-side encryption, or dedicated secrets manager)
- [ ] Audit log for access/modifications
- [ ] Two-factor authentication for vault access
- [ ] Secure transmission protocol to successor upon trigger

### Files Affected
- `src/App.jsx` → `AdminConsole` component (Successor Vault section)

---

## 5. Invoice PDF Generation

### What the UI Shows
- "Generate Invoice" and "Download PDF" buttons
- Opens print dialog with formatted invoice

### What's Actually Happening
- Generates an HTML blob and opens browser print dialog
- No actual PDF file created
- Invoice data is hardcoded, not pulled from WIP entries

### Backend Required for Production
- [ ] PDF generation service (Puppeteer, PDFKit, or third-party API)
- [ ] Invoice numbering system
- [ ] Pull actual WIP entries into invoice
- [ ] Invoice storage and history in Firestore

### Files Affected
- `src/App.jsx` → `BillingModule` component

---

## 6. Oracle AI Interface

### What the UI Shows
- Chat interface with AI responses
- Citation/source attribution
- Context-aware prompt suggestions

### What's Actually Happening
- Responses are hardcoded based on keyword matching
- No actual AI/LLM integration
- Citations point to fake documents

### Backend Required for Production
- [ ] LLM API integration (Claude, GPT-4, etc.)
- [ ] RAG pipeline: index trust documents for retrieval
- [ ] Prompt engineering for fiduciary-specific responses
- [ ] Citation verification against actual document corpus

### Files Affected
- `src/App.jsx` → `OracleInterface` component

---

## 7. Firebase Authentication

### What's Real
- ✅ Google Sign-In actually works
- ✅ User session persists

### What's Simulated
- User role/permissions (everyone is "Larry Lahr")
- Multi-user support
- Team/organization structure

### Backend Required for Production
- [ ] User roles: Admin, Fiduciary, Beneficiary (read-only)
- [ ] Organization/firm structure
- [ ] Invitation flow for team members

---

## Quick Reference: Code Tags

Search the codebase for these tags to find all simulated features:

```bash
grep -n "SMOKE_AND_MIRRORS" src/App.jsx
grep -n "DEMO_ONLY" src/App.jsx
grep -n "BACKEND_REQUIRED" src/App.jsx
```

---

## Version History

| Date | Author | Changes |
|------|--------|---------|
| 2024-12-23 | Claude | Initial creation - documented 7 smoke & mirrors features |

