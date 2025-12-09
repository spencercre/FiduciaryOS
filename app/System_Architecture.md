Fiduciary OS - Security Architecture (v2.0)

Core Principle: The "Fiduciary Exception" Firewall
The application creates a cryptographic separation between "Administrative" acts (discoverable) and "Defense" acts (privileged). This is enforced at the kernel level (Firestore Rules), not just the UI level.

Data Model & Roles

1. The Fiduciary (Admin)
Permissions: R/W on all Trust paths.
Scope: Managed via trusts/{id}/fiduciary_uid.

2. The Beneficiary (Observer)
Permissions: Read-Only on public classification.
Restrictions: explicitly DENIED on privileged classification.
Scope: Managed via trusts/{id}/beneficiary_uids array.

3. The Professional (Attorney/CPA)
Permissions: R/W on specific sub-modules (e.g., CPA can R/W Ledger, Attorney can R/W Documents).
Implementation: Custom Claims in Firebase Auth (token.role == 'cpa').

Search & Encryption Strategy (The Hybrid Model)
To balance "Zero-Knowledge" security with "Intelligent Search" usability, we employ a hybrid approach for the Privileged Zone:

1. The Iron Vault (Zero-Knowledge):
   - The actual file body (PDFs, Docx) and attachments are encrypted client-side before upload.
   - The Server (and thus the Search Engine) CANNOT read the contents of these files.

2. Metadata Indexing (Searchable):
   - Users are REQUIRED to provide 'Tags' (e.g., #tax-law, #peru) and a 'Description' when uploading privileged docs.
   - This metadata is encrypted at-rest (Server-Managed Keys) but is accessible to the Search Engine.
   - Result: Users can search for context ("Peruvian Tax Law") to find the file, without the server having access to the legal opinion inside.

Communication & Triage Strategy (The Ingestion Quarantine)
To solve "Conflict C" (Ease vs. Safety), we treat all incoming data as potentially dangerous until classified.

1. The Quarantine Zone:
   - Default landing spot for all ingested emails/documents.
   - Visibility: Fiduciary (R/W), Beneficiary (DENIED).
   - This prevents accidental disclosure of privileged info.

2. Smart Triage Logic (Automation):
   - The system analyzes the 'Sender' field of incoming items.
   - IF Sender == Attorney: Auto-move to 'Privileged Zone' (Iron Vault).
   - IF Sender == Beneficiary: Auto-move to 'Public Record' (Administrative).
   - ELSE (Unknown/Bank/Misc): Remain in Quarantine for manual Fiduciary review ("Approve/File").

The Dead Man's Switch (Legacy Protocol v2.0)
We utilize a dual-trigger system: Passive Heartbeat + Active Handshake.

1. Passive Trigger (The Watchdog):
   - Heartbeat: Fiduciary must log in every 30 days.
   - Action: If inactivity > 30 days, status updates to 'incapacitated_pending'.

2. Active Trigger (The Emergency Handshake):
   - Initiator: Successor Trustee requests access via UI.
   - Verification: System immediately sends Email + SMS to the active Fiduciary.
   - Timelock: A 48-hour countdown begins.
   - Release: If the Fiduciary does NOT explicitly click "DENY" within 48 hours, the system assumes incapacity.
   - Result: storage.rules unlock the /legacy_protocol/ folder and transfer Admin privileges to the Successor.
