# Correction Studio

Open Admin Studio → Question Bank → Correction Studio. Select a question, a new correct answer, the corrected explanation, and a reason. Preview the estimated impact, then apply. Processing runs in resumable ten-history-record pages while the dialog remains open. If interrupted, return and select Resume. No external scheduler is required. Only server-verified ADMIN_UIDS can invoke correction routes.

## Supported correction

This release supports answer-key corrections with unchanged question text, options, concept and competency. The catalog receives a new version; original assessment snapshots and submitted answers remain unchanged. Future questions and active submissions use the corrected answer key, mapping by option text because assessment options are shuffled. Subsequent key corrections update the overrides for prior versions.

Scores, cumulative answer evidence, the currently applicable mastery score, terminal session results and a correction receipt are committed atomically for each affected attempt. Optimistic preconditions prevent overwriting concurrent progress. Per-attempt receipts and job cursor checkpoints make retries idempotent. The latest submitted assessment continues to determine mastery; correcting an older attempt does not overwrite a newer score. Historical graph snapshots remain historical audit records.

A global correction barrier conservatively pauses personalized AI guidance during processing. Affected learner progress revisions and a correction epoch invalidate cached roadmaps and review plans. Corrected guidance is generated on the next learner request, subject to the existing AI allowance; correction jobs themselves do not spend AI quota. Results under review are marked provisional.

## Legacy data limitation

Earlier releases stored shuffled answer indices without the shuffled question snapshots. These cannot reliably be reconstructed. Affected legacy histories retain their original scores, receive a manual-review notice, and keep personalized guidance paused for that learner. The job ends as `needs-review`, never as fully corrected. View affected attempts to obtain the learner/attempt identifiers. There is no unsafe automatic clearance or fabricated historical answer mapping. Recovery requires verified original evidence or a separately reviewed migration/reset policy; that migration is not included.

## Boundaries

Ambiguous-question exclusion, multiple accepted answers, competency remapping and arbitrary scoring-policy migrations are not implemented by this answer-key workflow. Create a new question ID for changed wording/options/concepts. Corrected question identities cannot be deleted. Only one correction job runs at a time. A correction scans user histories and therefore incurs database reads proportional to the history size; this is not a dependency-index performance claim. Processing needs an admin to keep the dialog running or resume it. Recent job listing shows up to 50 jobs; receipt audit is paginated.

No claim of patentability is made. This is an engineering implementation using versioning, optimistic concurrency and auditable correction propagation.

## Validation

83 automated tests passed after implementation, including ten correction-specific tests: shuffled-option rescoring, active submissions, preserving later mastery, overlapping jobs/stale previews, legacy safety, interrupted-page retry, concurrent progress mutation administrator authorization, multi-page scans and successive corrections. Existing scoring, import, authentication, AI and recovery tests also pass. Tests use an in-memory Firestore-compatible adapter, not production credentials. Live Firebase and visual browser verification were not available in this environment.

## Student reports and AI-assisted detection (October 12 update)

Learners can select **Report a question** on the results screen, or **Report question** beside a saved attempt in Your Progress. The server checks ownership and requires a stored question snapshot. Students select a proposed answer (or unsure), explain their concern, and optionally supply an HTTPS reference. One report per learner/question version is accepted, with a five-new-question UTC daily limit. Reports persist before AI is contacted; quota exhaustion or an outage never discards them. References are not fetched or independently verified by AI.

Submitted assessments now collect one nonblank answer per distinct learner/question version. Repeated attempts by the same learner do not amplify the sample. After at least three distinct respondents, an alternative selected by at least two and at least 60% of respondents queues a suspected-error flag. This is a triage heuristic, not a conclusion that the key is wrong. Existing pre-release attempts are not backfilled into these statistics. Interrupted attempts do not contribute automatic signals.

At most one queued candidate is automatically sent for AI review per completed-assessment response. A student report can initiate review after a single attempt, regardless of the pattern threshold. Remaining candidates are visible in the paginated Correction Studio inbox and can be reviewed manually or with Run AI review. The AI review has a default cap of ten requests per UTC day (AI_QUESTION_REVIEW_DAILY_LIMIT), also subject to AI_GLOBAL_DAILY_LIMIT. Existing server-side AI configuration is reused; no new service is needed.

The inbox displays reports, submitted references, aggregated answer counts and AI findings. AI can return suspected-error, key-supported or uncertain. It cannot change an answer key, score or competency record. The interface clearly labels AI findings and links as unverified. Only administrators can inspect this inbox, record a dismissal/follow-up decision, reopen a review, or prepare an answer-key correction. All decisions are recorded. A new reporter can reopen a dismissed review. Preparing a correction prefills an available suggestion but requires independent administrator verification and an impact preview before applying. The correction job links back to the flag. Reports about older versions are marked outdated in the detail panel and cannot initiate a correction for the current version.

Question content/version and report revision are checked after AI generation; stale results are discarded. AI output is schema-validated, uses a short processing lease and is cached only for matching evidence and question content. Only question text, aggregate answer counts and report explanations/reference strings are sent to AI; account IDs and email addresses are omitted.

Validation: 95 automated tests pass, including twelve new tests for report ownership, deduplication, daily limits, distinct-learner patterns, shuffled choices, AI failures/quotas, stale suggestions, administrator approval and automatic API review. Worker bundle syntax and Vercel required-file checks pass. Live Firebase/provider and visual browser testing remain unverified.
