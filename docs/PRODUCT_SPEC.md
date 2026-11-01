# Blade Report — Reconciled Product Specification (November 2026)

Status: **Product requirements + functional prototype**, not a released field-reporting system. All seeded data, business names, people, costs, measurements and performance data in the demo are fictitious. A production backend and mobile app have **not** yet been built.

## 1. Product and principles

Blade Report connects wind turbine blade repair technicians, Team Leads, office administration, store/procurement, vehicle/fleet personnel, project managers, clients and company management. Target devices: iOS, Android, iPad, responsive web.

Design principles:
- **Record once, reuse everywhere.** A repair event should inform reports, daily outlook, cost and comparison views without retyping.
- **Calm technician UX.** Prioritise today's repair, current activity, requests, check-in/out, weather and two or three actionable tasks; hide office complexity.
- **Industry-specialist structure.** Blades, positions, approved materials, laminate plies, repair phases, controlled environmental conditions and inspection evidence must be first-class data, not just unsearchable PDF.
- **Human authority in safety/engineering.** AI can flag concerns but never independently certify an OEM procedure, technician competency, structural repair or safe-work condition.
- **Tenant security.** Company and client data remain segregated; explicit sharing and audit events are required.
- **Offline-first field workflows.** Mobile signal cannot be a requirement at a remote turbine.

## 2. Agreed feature areas

### 2.1 Repair reporting & custom forms
- Assign a report to organisation → client → project → country/site → turbine → blade ID/serial and position (A/B/C).
- Capture blade model/length, damage type, surface (PS/SS), leading/trailing edge, tip/root/internal web, radius from root, chord location and measured dimensions.
- Create repeatable repair stages via plus button: pre-inspection, damage assessment, grinding, core removal, drying/moisture, bonding, mixing, ply stacking/lamination, vacuum/cure, environmental checks, finish/coating, QC and signoff.
- Report parameters include fibreglass family, manufacturer product reference (e.g. BX661), glass/carbon/CSM/Biax/Triax/UD, gsm, orientation, cut length/width and applied ply count; distinguish repair footprint area, ply area and consumed roll area.
- Core: balsa/PET/PVC, geometry, thickness, area removed and inserted; resins, hardeners, adhesives, fillers and coatings, exact product variants, batch, expiry and consumed quantity.
- Preserve originals of uploaded images; record claimed capture timestamp/EXIF, received timestamp, checksum, edit history and provenance confidence. EXIF alone is not proof of time.
- Conditional report-builder templates by client, OEM, blade type, approved procedure version and location. Mandatory evidence rules and real qualified approvals. Restricted OEM documentation must not be copied into public code or redistributed without authority.
- Secure offline capture, per-stage drafts, conflict handling, then immutable final report/version and controlled PDF export.

### 2.2 Blade Passport & monitoring
- Unique blade identity and timeline of all repairs and inspection follow-ups.
- Search by serial, turbine, model, site, material, year, location and damage class.
- Inspections: baseline observation, repeat measurements and images, comparison with earlier visits, scheduled date, status (unchanged/propagation/engineering review/closed), overdue alerts.
- A single blade can appear on projects from different authorised contractors; access is by explicit client/tenant agreement, not open cross-company visibility.

### 2.3 Daily field & operations
- Technician shift check-in/out and time categories: direct repair, travel, reports, standby, waiting and other; Team Lead shared operational events propagate to affected people while preserving individual exceptions.
- Record briefing, transfer of turbine control, rotor lock/LOTO and platform/access procedures as **evidence of recorded activity**, never a replacement for the actual permit or safety authorisation.
- Environmental readings: wind m/s and gusts, rain, RH, ambient/surface temperature, dew point and margin, instrument/SCADA source, photo and timestamp; thresholds from exact approved specifications.
- Compact optional forecast card with provider, issue time and location; forecast is not a replacement for measured conditions.
- Downtime with start/end, custom reason, comments, team/personnel affected, photo, supervisor and related equipment. Distinguish elapsed event hours and affected person-hours, and classify controllable/uncontrollable/contractual treatment.
- Daily progress and client report generation from timestamps and verified event records.

### 2.4 Fleet & equipment
- Vehicle assignment, registration, checklists, mileage, tyres, seasonal winter compliance by locality, lights, brakes, leaks, damage, equipment and inspections due.
- Defect severity and photo/evidence; route to selected store/fleet/project manager, create a task, record repair and qualified safe-to-use clearance.
- Tool/equipment availability, maintenance, rental returns and calibration or statutory inspection due; link failures to downtime and procurement.

### 2.5 Materials, requests and commercial controls
- Approved/specification library separated from general catalogue and unverified materials.
- Suppliers and product variants such as Ampreg 31, SikaBiresin CR910, Resin L (precise variant to verify), Araldite 2021/2022, Sika adhesive/filler families, MW1/Windmastic/Bergolin etc. Never infer interchangeability.
- Stock ledger: purchase/receipt, transfer, reserve, issue, consume, return, waste, count adjustment, batch traceability and price history.
- Project request flow: Requested → Approved → Ordered/In Progress → Partially Fulfilled → Dispatched → Received/Completed; custom requests and contact/notes/evidence.
- GBP, EUR, SEK, NOK, USD, project currencies and historical FX snapshots, company rates, markups, invoice drafting/export. Sensitive cost data restricted to office/finance roles.
- Supplier and material delivery delays link to repair tasks and project forecasts.

### 2.6 People, competencies and tasks
- Profiles showing experience, repair roles, training, verified documents and expiring competencies with green valid (>6 months), amber expiring (≤6 months), red expired, reminders at 6/3/1 months.
- Company-specific role-based access (Tech, TL, Store, Back Office, PM, Company Admin, Client Viewer; separate system operator), invitation and company affiliation; project and data-level permissions.
- Blade Tasks: personal and office-created tasks, category, priority, owner and assignee, delegated children, notes, evidence, due dates, acknowledgements, meaningful notifications and escalation.
- Personal private tasks stay private unless shared; do not automatically surface sensitive HR work to PMs.
- Notifications grouped, only action-required prominent; reading a notification never closes the task.
- AI workload suggestions consider estimated effort, competence, location (same office preferred), availability, leave, deadline and permission. Initial mode = **recommend only**. No automatic safety-sensitive task reassignment.

### 2.7 Performance Intelligence
- Filters across site, country, team, technician, project, blade model, repair type, competency, materials, period, weather, quality and costs.
- Compare repair footprint, fibreglass types/weight, total applied ply area, ply count, core dimensions and volume, resin use, direct person-hours, working days, downtime, quality and rework causes.
- AI can extract candidate structured facts from authorised historical PDFs, with citations back to source, confidence, review queues and no invention of missing fields.
- Statistical benchmarking only with adequate samples, validated measurements, stratification and uncertainty; avoid naive 'repairs per person' or simple fast = best ranking.
- Workforce data needs lawful basis, transparency, limited access, challenge/correction and human assessment for pay and employment decisions. Never solely automated dismissal, contractor retention or pay decisions.

### 2.8 Blade Outlook reporting
- Daily/weekly/monthly/custom period; site, team, job, client and turbine filters.
- Simple (plain-language), Standard (figures and progress), Technical (repair/stage specifications and evidence).
- Project progress, completed stages, planned vs actual labour, downtime reasons, issues, next actions, materials risk, remaining work and cautiously framed forecast ranges.
- Management-editable notes, client-sensitive field redaction, versioning, provenance to original evidence, manager approval and scheduled draft generation.
- Export PDF/CSV/Excel, client portal with approved read-only access. AI reports **draft only** until reviewed.

## 3. Data model — initial bounded contexts

**Identity / organisation:** organisation, account, membership, role, permission, site, client, contract, project.

**Asset:** turbine, blade, blade position, technical model, blade location, defect, repair and monitoring event.

**Repair:** report template, versioned form schema, repair instance, stage, stage measurement, material line, photo/evidence record, QC result, reviewer approval, audit event.

**Operations:** crew, site assignment, shift, activity segment, downtime event, affected personnel mapping, daily summary, weather observation and forecast snapshot.

**Procurement / fleet:** catalogue product, approved spec, batch, stock location, stock transaction, request, PO, receipt, vehicle, inspection, defect, service action.

**People / work:** technician profile, company credential, competency, verification document, task, task ownership, assignee, task status event, notification, availability.

**Reporting / analysis:** immutable derived fact snapshot, aggregate, benchmark cohort, report template, generated report draft, edit, approval and delivery event.

Use organisation/project identifiers on records with explicit tenant-aware indexes. Store original images in private object storage; database stores metadata and checksums, not the photograph blob. AI reads authorised, selected records only, outputs suggestions with traceable sources.

## 4. Release order and definition of done

### Stage 0 — Public prototype (current branch)
- Clickable/responsive 17 sections.
- Local browser operations for sample repairs, tasks, requests, stages, downtime, vehicle checks, material usage, inspections, weather, shifts, competencies and outlook drafts.
- Test data only; no login, cloud sync or legal evidence integrity.
- Review visually on Mac, iPad and phone before final UI choice.

### Stage 1 — Private production foundation
- Private repo + secure backend, managed PostgreSQL, organisation-level isolation and server-side RBAC.
- User invitations, secure accounts, user/company/project assignments, sites, turbines and blades.
- Encrypted storage, access logs, automated database migration/test/backup and restore drill.
- Real repair CRUD with controlled templates and secure media upload.
- Ready only when two separate customers cannot access one another's records and technical recovery tests pass.

### Stage 2 — Field pilot
- Resilient offline mobile edit/sync and duplicate/conflict resolution.
- Photo evidence original preservation and provenance checks.
- Repair-stage versioning, QC signoffs, environmental logging, downtime, timesheets, materials requests, vehicles and competencies.
- Controlled PDF output with client branding. Real role tests and field usability pilot.

### Stage 3 — Commercial SaaS
- Subscription billing for role-based monthly/annual active licences; secure client viewer and project approvals.
- Full material ledger, batch traceability, finance, alerts, report scheduling, exports and support/admin tooling.
- Data retention/export policy, breach response, application security review, user training and observability.

### Stage 4 — Data & AI
- Authorised historical PDF import with manual validation.
- Repair comparison by type/material/geometry and source-level evidence; measured uncertainty.
- Predictive job effort/material ranges, workload suggestion engine, client narrative drafts with signoff.
- Privacy and employment-law review of individual workforce analytics before activation.

## 5. Quality, reliability, security and financial gates

- No real customer or employee data on a public GitHub Pages prototype.
- Production tenancy isolation and role permissions tested at API and storage layers; frontend hiding is not security.
- Device/offline encryption, HTTPS and confidential tokens managed server-side; no secrets in static JS.
- Clock skew, duplicate photo detection, failure/retry, revocation and audit semantics tested before site pilots.
- Report values clearly identify evidence source vs derived estimate vs speculative AI suggestion.
- Performance/quality and safety-related flags always reviewed by qualified people.
- Avoid worker tracking beyond stated purpose, lawful basis and appropriate transparency/retention.
- Per-customer storage, download traffic, background jobs and AI costs are monitored to preserve SaaS margins.
- Early commercial launch follows customer interviews and paid pilots, not feature count alone.

## 6. Prototype caveats

The demo uses `localStorage`, not a database; changing a role dropdown does not grant or restrict real access. Browser data can be lost and is not shared with other users or devices. Spreadsheet/PDF output, native app, original photo custody, AI, approval workflows, scheduled notifications, true weather provider integration and enterprise security are **not yet implemented**. They appear as future capability or read-only design in the interface.

**Immediate next engineering priority:** after approving the prototype's look, initialise the private production application and implement organisation/authentication/project/blade data model, then secure repair and photo evidence workflows before any live trials.
