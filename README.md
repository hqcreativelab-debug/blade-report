# Blade Report

**Blade Report** is a planned wind turbine blade repair operations platform, currently in **functional browser-demo development**.

**Current preview:** https://hqcreativelab-debug.github.io/blade-report/

> The public GitHub Pages deployment currently follows `main`. Changes under `feature/operational-foundation` are **not live** until reviewed and merged. This is intentionally a demo, not a production workplace system.

## What the development branch does now

- Responsive desktop and technician-facing layouts covering 17 sections.
- Create repair reports, add repeatable stages, record labour, fibreglass ply area, ply counts, core area, resin and QC status.
- Create, edit, delegate and complete office/project tasks.
- Create material or equipment requests that also generate a store-manager task.
- Start and end downtime events, reporting both elapsed event hours and affected person-hours.
- Record vehicle checks, tyres and defects; automatically route defects to a fleet task.
- Record materials, adjust sample stock on issuance, link consumption to repairs, and produce indicative job-cost views.
- Log site weather readings, blade monitoring visits, competencies, working days, check-in/out and manual timesheets.
- Build rule-based summaries and filtered comparisons from stored example records.
- Export sample data as JSON or CSV, and restore demo JSON.

**Data is stored in your own browser using `localStorage`. There is no authentication, cloud database, actual team collaboration, AI analysis, email, reliable offline synchronisation or evidential original-photo handling.** Never enter real personal information, live customer records, restricted repair procedures, commercial secrets, photographs or credentials into the demo. Even if a screen resembles an approval, no safety or engineering approval occurs.

## Quick start

Open `index.html` directly, or serve the folder locally (e.g. `python3 -m http.server 8000`) then open localhost. No dependencies, API keys or payment services required.

The site uses `index.html`, `styles.css`, `app.js` and `features.js`. There is no build or installation step.

## Review / deployment

1. Review the feature branch and its pull request.
2. Run `node tests/smoke.cjs` or inspect automated checks.
3. Merge to `main` only after approval.
4. GitHub Pages on `main` will publish the updated preview.

## Project documents

See [PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) for the reconciled feature inventory, data model, launch priorities, security constraints and development roadmap.

## Proposed production direction

- **Private commercial repository** for backend and privileged application code.
- Multi-tenant PostgreSQL database with server-side authorisation and row-level isolation.
- Object storage for original photos and documents, tamper-evident provenance metadata, an immutable audit trail and retention policies.
- Mobile app designed around encrypted offline editing and resilient conflict-aware synchronisation.
- Server-side report/PDF/notification jobs, controlled AI extraction and qualified approvals.
- Progressive pilot deployments, technical and security testing before real customer use.

The public GitHub Pages repository should remain a **fictional design/demo preview** only.
