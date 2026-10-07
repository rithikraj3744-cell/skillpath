# SkillPath 1.2.0 — verification report

Automated checks run against the actual source using `npm test`.

## Covered by automated tests

- Google provider setup for new and returning accounts; popup cancellation,
  popup blocking, disabled provider, and unauthorized-domain messages.
- Verified Google identity creates a learner profile once and preserves saved goals.
- AI temporary-failure retry, retry limit, normalized model/key settings, invalid
  model configuration, quota/permission/model errors, timeout, malformed output,
  truncation, and exclusion of reasoning text from the returned JSON.
- AI error messages do not leak simulated credentials or upstream project details.
- AI schema validation, caching, changing goals during generation, and completed
  pathways that should not consume an AI call.
- Expanded catalog record validation, prerequisite cycles, lesson coverage, and
  question coverage for every career path.
- Data Analyst and Applied AI baseline assessments, shuffled answer mapping,
  saved scores, history, unlocked lessons, and lesson completion.
- Admin access denial for learners, record create/edit/delete, stale writes,
  reference checks, and idempotent library import.
- Cross-origin write denial, profile/history ownership, server-only answer keys,
  atomic assessment updates, replay protection, and quota limits.
- Learner view rendering, escaped profile text, provider-neutral labels,
  progress-aware guidance, and milestone rendering.

Deployment checks also verify required frontend/backend assets, Worker ESM output,
retired page URLs returning 404, setup behavior, and private server-source isolation.

## Not verified in this environment

The required browser-control skill is unavailable. No live visual browser test,
physical-device test, real Google OAuth flow, or request using your production AI
credentials was performed. No production learner data was changed by these tests.

## Production acceptance checklist

1. Enable Google in Firebase and authorize your production hostname.
2. Sign up with a new Google account; choose and save a career. Sign out and back
   in with the same account. Confirm the saved goal remains.
3. Verify an existing email/password account, password reset, and sign-out.
4. Add the learning library as admin; repeat the operation and confirm zero new
   records are added on the second run.
5. As a learner, complete a lesson and quiz; refresh and check scores and history.
6. Generate an AI plan. Verify personalized text appears. If the provider rejects
   the request, check the visible message and confirm saved scores remain.
7. Check phone widths 320/390 px, tablet widths 768/1024 px, desktop widths
   1440/1920 px, phone landscape, and 200% browser zoom.
8. Check keyboard navigation, mobile drawer dismissal, Google popup cancellation,
   admin editor scrolling, long content, and assessment navigation.
