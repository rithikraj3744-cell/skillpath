# Evidence workflow verification

Verified on October 13, 2026. The evidence and approved answer-key correction workflow is already implemented in this project. This delivery adds two regression tests and makes npm run build use the portable Vercel validation command.

## What is implemented

- Completed and interrupted attempts retain selected answers, shuffled question snapshots, question versions, competency and concept associations, and the scoring policy.
- Cumulative concept evidence records correct, wrong and unanswered counts. Unanswered items alone do not establish weakness.
- Student correction reports and distinct-learner answer-pattern signals enter Correction Studio. AI findings are suggestions, not approval.
- An administrator previews impact and approves an answer-key correction. Processing is resumable and preserves original snapshots.
- Eligible attempts are rescored, with review evidence, current mastery, session results and audit receipts updated atomically. Repeating a processing request does not award marks twice.
- A wrong-to-correct answer changes net marks by +1.25 under the current policy.
- Corrections to older attempts do not replace the mastery result of a newer submitted assessment.
- Personalized guidance is paused while correction processing is active. Changed evidence invalidates cached study plans and roadmaps. Guidance is regenerated on the next request, subject to AI quota.
- Historical graph snapshots remain unchanged as audit evidence. Current graph nodes are recalculated from current progress.
- Legacy attempts without question snapshots require manual review. Their shuffled answers are never guessed.

## Where to use it

1. Configure Firebase and AI using README.md and .env.example. Keep real credentials outside this ZIP and source control.
2. Sign in as a learner, choose a career and complete an assessment.
3. Use Report a question on results, or Report question in Your Progress.
4. Sign in with a UID included in ADMIN_UIDS. Open Admin Studio, Question Bank, Correction Studio.
5. Inspect the report and answer evidence. Independently verify the correct answer.
6. Preview impact and apply the correction. Keep the dialog open until processing completes, or use Resume.
7. Refresh the learner's progress. Check the correction reason and score change. Request an updated study plan or roadmap.

## Verification

97 automated tests passed, with no failures. The tests use an in-memory database and mocked AI responses, not live Firebase or provider credentials. Additional tests verify the 1.25-mark repair, removal of a false weakness, unchanged original answers and graph snapshots, audit receipts, and invalidation/regeneration of a saved journey.

Live authentication, email delivery, database permissions, provider responses and visual browser behavior still need verification in your deployment.

## Scope

This is answer-key correction with unchanged question wording, options and competency mapping. Multiple accepted answers, question exclusion and arbitrary scoring-policy migrations are not included. AI does not independently browse student references. Plan updates use cache invalidation and regeneration, not a claim of minimal LLM patching or a general versioned-graph repair algorithm. No patentability claim is made.

## Files

server/assessments.js stores assessment evidence and creates study guidance.
server/corrections.js versions keys and repairs affected results.
server/question-quality.js handles reports and AI-assisted question review.
server/api.js invalidates stale journeys and enforces authorization.
tests/corrections.test.mjs contains correction and evidence-repair regression tests.

## Run and deploy

Use Node.js 22 or newer. Run npm test and npm run build. For local full-stack development, configure .env.local and run npm run dev (Vercel CLI). Import this folder into Vercel using the included vercel.json, add environment variables and authorize your domain in Firebase Authentication. Opening index.html directly does not run the API.

npm run build in this downloadable edition validates the Vercel source files. scripts/build.mjs is the separate ChatGPT Sites Worker builder and requires a hosting manifest from that environment. The ZIP intentionally excludes Site identity, credentials, generated build output and nested source ZIPs.
