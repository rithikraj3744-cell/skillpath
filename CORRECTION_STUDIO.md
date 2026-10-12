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
