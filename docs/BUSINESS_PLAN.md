# Blade Report — Commercial Plan (working assumptions, November 2026)

## Proposition

B2B software for blade repair contractors, initially focused on small and medium teams. Reduce administration and improve data quality by connecting reports, photos, timesheets, downtime, materials, fleet, competence and client updates. Advanced inspection / analytics / AI become paid differentiation *after* the core field product proves valuable.

### Who pays
1. Independent blade repair and composite repair contractors (pilot ICP).
2. Larger multi-team wind service contractors.
3. Wind farm operators needing blade history and maintenance monitoring.
4. OEM/manufacturers with their own inspection, documentation and integration needs.

### Pricing hypotheses (GBP excl. VAT; require paid-pilot validation)
| Licence | Hypothesis per active user per month |
| --- | ---: |
| Technician | £25 |
| Team Lead | £39 |
| Office/Company Admin | £59 |
| Client Viewer | Included limited read-only access |

Suggested base subscription: Starter £99/month, Business £299/month, Enterprise negotiable. Optional charges for additional storage, AI volume, custom integrations, enterprise onboarding and historical report imports. Do not charge per photograph/report; incentivise complete evidence. Seasonal workforce active-licence adjustments, annual contracts and minimum seats to test in interviews.

Example: ten technicians, two Team Leads, two office accounts + Starter base = (10×£25)+(2×£39)+(2×£59)+£99 = **£545/month** or **£6,540 year-end ARR** if sustained for a year.

### Validation before spending on enterprise development
- Interview 10–15 contractors about actual reporting time, current systems and procurement requirements.
- Run 2–3 supervised, paid pilots using real-world complexity only after secure production foundations exist.
- Measure time saved per approved report, proportion of reports returned for correction, overdue requests, client-report preparation time and data completeness.
- Confirm willingness to pay using contracts or paid pilot fees, not hypothetical surveys alone.
- Review client confidentiality, OEM procedure licensing and data protection early.

### Growth illustration (not a forecast)
At £1,000 average monthly subscription: 10 organisations = £120k annualised recurring revenue; 25 = £300k; 50 = £600k; 100 = £1.2m. ARR is **not profit** or cash revenue recognised during that year. Acquisition, development, storage, security, support, churn and seasonality can dominate costs.

### Cost, margin and operations
- Managed database and object storage with recorded backup/restore and retention policies.
- Variable costs per tenant: stored originals/versions, traffic/egress, generated reports, background jobs and AI calls.
- Fixed costs: engineering, incident response, cybersecurity reviews, insurance, onboarding, billing, support and legal.
- Measure gross margin by customer, avoid unlimited high-volume AI usage on flat low-price subscriptions.
- For employee analytics, ensure fairness, lawful processing and qualified human review; never promise employment decisions by AI.

### Go-to-market milestones
1. Approve functional public *demo* with fictitious data only.
2. Establish separate **private** production repository, PostgreSQL tenancy isolation and secure media storage.
3. Release stable offline-capable field pilot with QC workflow and authorised templates.
4. Convert pilot customers to paid monthly/annual contracts.
5. Launch Blade Outlook and advanced project costing.
6. Add validated AI-assisted extraction, repair benchmarking and capacity suggestions when sufficient verified data exist.

The first commercial product should win on *fast, accurate repair documentation and clear office visibility*, not on a long feature checklist.
