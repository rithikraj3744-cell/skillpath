# SkillPath — Connected Learning Platform · 1.2.0

HTML, CSS and vanilla JavaScript frontend with Firebase Authentication, server-owned Firestore storage, Gemini-generated learning plans, Cytoscape knowledge graphs and Chart.js progress charts.

For this update, start with **UPDATE_GUIDE.md**. For an existing Vercel installation, also see **LAUNCH.md**. This release needs no database migration.

## Current delivery

The connected application is implemented, but live Firebase and Gemini account verification requires your credentials. Before configuration, `/` shows a setup checklist.

Implemented:
- Google login/signup, registration, email/password login, password reset, session restoration and logout using Firebase Authentication.
- User-owned profiles, career selection, lesson completion, scores and assessment history.
- Secure server scoring; answer keys are omitted when starting an assessment.
- Atomic scoring/progress/history/graph-snapshot writes and idempotent submissions.
- Prerequisite-aware roadmap and graph, weak-concept remediation nodes, mastery unlocking at 90%.
- Personalized Gemini generation with validated JSON, prerequisite ordering, cache invalidation and a persistent per-user daily quota.
- Admin Studio: create/edit/delete competencies, careers, lesson content and questions; search records; view paginated registered learner profiles; add the learning library.
- Admin UID allowlist checked server-side on every admin operation. The browser cannot assign roles.
- Reference validation, cycle prevention, dependent-record deletion checks and optimistic edit conflicts.

Starter content: 23 competencies, 5 career paths, 23 lessons, 57 questions. Admins can create additional paths. These are introductory teaching materials intended to be expanded through Admin Studio.

## Your setup checklist

1. Create a Firebase project and register a Web app.
2. Enable Authentication → Sign-in method → Email/Password and Google. Select a support email for Google and save.
3. Add your deployed hostname to Authentication → Settings → Authorized domains. Add localhost for local development.
4. Create a **Firestore Standard / Native-mode** `(default)` database, in production mode.
5. Publish `firestore.rules`. All direct browser database access is denied; the server uses a dedicated service account and validates each operation.
6. Create a dedicated Google Cloud service account in the same project with **Cloud Datastore User** (`roles/datastore.user`) access. Create a JSON key, and paste its full JSON as the secret `FIREBASE_SERVICE_ACCOUNT_JSON` in your hosting environment. Do not commit the key.
7. Copy the Web app's projectId, apiKey, authDomain and appId into the environment variables listed below.
8. Add your own user in Authentication → Users. Put that Firebase UID in `ADMIN_UIDS` to grant administrator access. Administrator access is granted only through the UID allowlist.
9. Create a Gemini API key in Google AI Studio and configure an available model supported by your account. Free-tier availability/quotas are not guaranteed by this application.
10. Redeploy after changing environment settings. Sign in as admin, add the learning library, select a career in your profile, and complete the verification flow below.

## Environment variables

| Variable | Value | Secret? |
| --- | --- | --- |
| FIREBASE_PROJECT_ID | Web config projectId | No |
| FIREBASE_API_KEY | Web config apiKey | No |
| FIREBASE_AUTH_DOMAIN | Web config authDomain | No |
| FIREBASE_APP_ID | Web config appId | No |
| FIREBASE_SERVICE_ACCOUNT_JSON | Full single-line JSON for the dedicated server service account | Yes |
| ADMIN_UIDS | Comma-separated Firebase Authentication UIDs | Server-only |
| GEMINI_API_KEY | Google AI Studio API key | Yes |
| GEMINI_MODEL | Available model ID for your account | No |
| AI_DAILY_LIMIT | Optional integer, default 5, clamped to 1–20 | No |
| AI_GLOBAL_DAILY_LIMIT | Shared attempted generations per UTC day, default 100, clamped to 1–10000 | No |

Firebase web configuration is public and delivered by `/api/config`. It does not authorize access. Gemini and service-account secrets are never returned. Protect Firebase configuration with the application's server authorization and deny-all Firestore rules, not by hiding its public web API key.

## Vercel deployment

1. Import this repository into Vercel. Choose **Other** as the framework, Node 22 or newer.
2. The included `vercel.json` serves `public/` and rewrites `/api/*` to the shared Node function in `api/index.js`.
3. Set the environment variables above for the deployment environment.
4. Deploy, authorize the Vercel hostname in Firebase Auth, and sign in.

Local development: copy `.env.example` to `.env.local`, populate it locally, run `npx vercel dev`. Keep `.env.local` untracked. The frontend needs the API; opening index.html directly is not sufficient.

The current ChatGPT Site uses an equivalent Worker ESM adapter. Its existing private access boundary remains intact. Firebase authenticates application users inside that boundary. No audience changes are made by this code.

## Architecture

- `public/js/auth.js`: Firebase Auth SDK integration; token refresh and persistence.
- `public/js/api.js`: same-origin API client using Firebase ID tokens.
- `public/js/learner.js`: dashboard, graph, lessons, assessment, progress and profile.
- `public/js/admin.js`: protected data-entry forms, record tables and seeded content.
- `server/api.js`: application routes, ownership checks, admin authorization and Gemini calls.
- `server/firebase.js`: verified Firebase user lookup, service-account OAuth and Firestore REST transport.
- `server/engine.js`: deterministic validation, scoring, prerequisites and AI response validation.
- `server/seed.js`: optional starter catalog, added explicitly by the administrator.
- `api/index.js`: Vercel adapter.
- `scripts/build.mjs`: builds the current Site Worker without adding a frontend framework.

Firestore collections: users, progress, journeys, sessions, competencies, careers, modules, questions, metadata and aiUsage. Each user's history and graphVersions are nested below users/{uid}. Questions are visible only to admins or as sanitized assessment-session content. Learners can review the answers only after submission.

One lesson per competency is supported; an admin can expand the lesson body and resources. Scoring uses the latest assessment result for each tested competency. Mastery is 90%; target score is descriptive and used to calculate the skill gap. Changing a career retains existing scores. Lesson completion does not itself grant mastery. Self-reported skills do not grant scores.

On failed quizzes, weak concepts become remediation branches in the graph. Roadmap availability is recalculated immediately; Gemini is called after submission when configured. A Gemini failure never rolls back a saved quiz. Learners can retry personalization explicitly. Graph snapshots are saved with assessments for reconstruction.

## Verification

Run `npm test` for server authorization, CRUD, data isolation, reference/cycle validation, prerequisite locking, scoring, idempotent submission, graph snapshots, Gemini output/caching/errors, and config secrecy checks. Tests use an in-memory Firestore adapter and mocked external responses; they do not prove that your external account configuration works.

Run `npm run build` and `node scripts/validate-artifact.mjs` for the Site adapter. Syntax checks are also performed on application modules.

After configuration, verify against your real project:
1. Register learner A; save a career and profile; reload and sign back in.
2. Sign in as admin; seed the catalog; create and edit a competency, lesson and question.
3. As learner A, complete the baseline assessment, open an unlocked lesson, complete it and submit its quiz.
4. Confirm scores, history, weak concepts, unlocking and roadmap changes persist after reload.
5. Generate a Gemini plan; verify a second unchanged generation uses cache.
6. Register learner B and confirm learner A's private data is not visible. Confirm admin routes reject learner B.
7. Test password reset, wrong credentials, quota failures, and mobile navigation.

Live account tests and visual browser QA remain pending; no external credentials were present during implementation.

## Operational limits

This version is designed for a semester project and a small learning cohort. Catalog reads are bounded (up to 400 records per collection for admin entry); learner history displays the latest 30 assessments and admin learners paginate in groups of 50. Firestore reads occur on workspace refresh and explicit actions, not realtime listeners. AI requests have timeouts and a persisted daily quota. A shared daily AI generation cap limits calls across accounts; Firebase Auth signup abuse protection, Firestore budgets, backups and broader load testing still require deployment-specific work. Failed upstream AI requests count toward the limits, and limits reset at midnight UTC.

No service account or API credentials should be entered into browser forms, admin content, source code, or chat messages. Change server secrets through hosting environment settings, then redeploy.

Official setup references:
- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/auth/web/start
- https://firebase.google.com/docs/firestore/use-rest-api
- https://firebase.google.com/docs/firestore/security/iam
- https://ai.google.dev/gemini-api/docs/structured-output
- https://vercel.com/docs/functions/runtimes/node-js
