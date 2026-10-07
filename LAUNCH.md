# SkillPath 1.2.0 — Update and launch

## Upgrade your working Vercel website

1. Keep your existing Firebase project, Gemini key, Vercel environment variables and admin UID. No database migration or reseeding is required.
2. Extract this ZIP locally. Copy its api/, server/, public/, scripts/, tests/ folders and root project files into your existing source folder, replacing matching source files. Keep your existing local .env.local outside the upload. Do not include your service-account JSON.
3. Commit these changes to the same GitHub repository/branch connected to Vercel. For a browser upload, drag whole folders to preserve their paths; do not upload only root-level files or the ZIP.
4. Keep Vercel Framework = Other, Root Directory = folder containing package.json and api/, Build Command = node scripts/vercel-build.mjs, Output Directory = public, Node = 22.x.
5. The existing environment variables continue to work. Optional AI_GLOBAL_DAILY_LIMIT defaults to 100 attempted generations across all users per UTC day; set a smaller value if needed. AI_DAILY_LIMIT defaults to 5 per user. These are application limits, not a provider billing cap.
6. Deploy the latest commit. Hard-refresh the browser (Ctrl+Shift+R). Check /api/health: it should show version 1.2.0. Health is a liveness check only and does not test provider credentials.

## What changed

- Fix for “API route not found” when an administrator enters Python - Basics or python - basics as a record ID. Forms suggest safe IDs from names and normalize manual input on blur/save; server validation now returns a useful 400 response. Names can retain capitals and spaces. Existing IDs are immutable and unchanged.
- Duplicate-ID checks, character counters, unsaved-form confirmation, and dialogs with visible close and save controls.
- Catalog readiness checks flag missing careers, lessons and question banks.
- First-step checklist for learners, password confirmation/visibility, help and data-use guidance, offline feedback, page titles, keyboard navigation and more readable forms.
- Shared AI quota and rejection of stale AI results when a learner changes goals during generation.
- Unknown hash routes are mapped to safe routes; request bodies require JSON objects; packaging validates required backend files.

## Verify on your real Vercel URL before inviting learners

- Create a competency by typing Python - Basics; confirm Record ID becomes python-basics and the display name remains readable. Save, reload, edit, and check it persists.
- Add a career containing the competency, its lesson, and several distinct questions. Resolve relevant Catalog readiness warnings. Use separate competencies for large topics; a description is limited to 1,000 characters and lesson content to 20,000.
- Sign in as a separate learner. Save a career and weekly hours; complete a baseline assessment; study an unlocked lesson; submit a quiz. Refresh and confirm progress persists.
- Confirm the learner cannot open Admin Studio or save admin records, and another learner cannot see the first learner’s data.
- Test Gemini personalization with the model your account supports. A successful result has a Gemini label. Try again unchanged to confirm it reuses the saved result. The app must remain useful when AI is unavailable.
- Test password reset, sign-out on shared devices, and narrow/mobile screens. Test keyboard navigation, dialog close, long form scrolling and an interrupted connection.
- Verify the current hostname is authorized in Firebase Auth and direct Firestore access is denied by the supplied rules.

## Before a broad public launch

This release is suitable for a small-course rollout after the live checks above. Supply your actual support contact and organization-specific privacy/retention terms before broad public distribution; the built-in Help page is a factual product data-use explanation, not a legal policy. Review lesson quality and add enough questions to assess each competency. Configure provider quotas/usage alerts, Firebase Auth protections, and a backup/recovery procedure appropriate to your account. Keep raw service-account credentials out of source control.

Rollback code through Vercel's previous deployment if required. No existing learner records or catalog IDs are migrated by this release.

## Verification performed on the release source

23 automated tests cover authorization, scoring, data isolation, record validation, stale edits, prerequisite locking, AI caching/failures/quotas, the reported invalid-ID bug and changes of learner goal. Tests use mocked external services. JavaScript syntax, Vercel source layout and the Site Worker artifact are checked separately. Browser-based visual QA and live Firebase/Gemini tests could not be run in this environment; the operator must complete the live checklist above.
