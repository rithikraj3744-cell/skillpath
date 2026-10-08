# SkillPath 1.5.0 — Verification

## Automated suite

Run `npm test`. The 71-test suite includes the prior coverage plus India-midnight reset, daily quota enforcement, concurrency, duplicate focus-event handling, third-exit lock, interrupted/expired attempt evidence, stale checkpoints, AI review caching/fallback and fullscreen rejection. Coverage includes:

- 1,400 valid starter questions, exactly 40 per competency, career coverage and prerequisite order.
- Forty unique session questions, shuffled answer mapping, private answer keys, resumable sessions, insufficient-bank errors and obsolete scoring-policy rejection.
- +1/−0.25/0 marking, exact 60% boundary, skips, negative raw totals, percentage floor, unlocking, atomic saves and idempotent submission.
- Excel aliases, title rows, competency matching, letter/number/text keys, invalid and ambiguous rows, stable IDs and byte-bounded batches.
- The actual downloadable XLSX read with the production SheetJS reader: 40 valid rows, matching answers and no formula/error cells.
- Admin-only imports, atomic batches, duplicate protection, safe re-import and bounded/resumable seeding preserving custom records.
- OTP verification before reset, hashed codes, single-use codes/tokens, concurrent verification, expiry, five-attempt limit, resend cooldown, rate cap, unknown-account response and delivery-failure invalidation.
- Existing authorization, data ownership, Google flow, profile changes, modules/resources and AI validation/cache/quota/error behavior.

External Firebase, Firestore, AI and Resend calls are mocked. Tests do not establish that production credentials, IAM, domains, quotas or email delivery work.

## Artifact checks

JavaScript syntax; Vercel source layout; Worker ESM, assets, sample download, setup mode and server-source isolation; workbook sheets rendered and visually inspected; source ZIP excludes credentials, local environment files, repository identity and nested release ZIPs.

Commands: `node scripts/vercel-build.mjs`, `npm run build`, `node scripts/validate-artifact.mjs`.

## Remaining live checks

Firebase sign-in/storage, Google popups, Resend delivery, actual IAM and AI generation need the operator’s accounts. Browser visual/device testing could not run because the required browser-preview capability was unavailable. Responsive styles and rendered HTML checks are not substitutes for live browser testing. Complete LAUNCH.md on the real deployment before inviting learners.
