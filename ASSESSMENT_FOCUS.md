# SkillPath 1.5.0 — Focused assessments

## Rules learners see before starting

- The browser enters fullscreen from the learner's Start/Resume click. A browser that cannot grant fullscreen cannot start a new attempt; no daily slot is consumed by a fullscreen failure.
- A competency allows **three starts per learner per calendar day**, resetting at **00:00 Asia/Kolkata (India time)**. A submitted, ended, expired or automatically closed attempt consumes its start. Resuming the same active attempt does not consume another.
- A hidden tab, minimized window, or fullscreen exit is a departure. Related visibility/fullscreen/page-hide events during one absence count once. Counting re-arms after the learner returns to a visible fullscreen document.
- The **third departure** ends the active attempt and locks that competency for the rest of the day, even if fewer than three starts were used. Lessons and study guidance remain available. If an attempt crosses midnight, a third departure locks the competency for the current day too.
- Only a normally submitted assessment updates mastery. Closed, expired or manually ended attempts preserve existing mastery and contribute answer evidence for revision. Scoring remains 40 questions, +1 correct, −0.25 wrong, 0 unanswered, 60% pass target.

## Persistence and study guidance

Answers are checkpointed to the server as they change and backed up in session storage. Answer revisions prevent older checkpoints from replacing newer answers. Exit counts only increase. Daily counters, session changes and final evidence/history writes use Firestore preconditions to handle races. A second start cannot silently discard an active assessment for another competency.

On completion/closure, the website shows a study plan using cumulative concept-level correct/wrong/unanswered counts across the learner's recorded attempts for that competency. This includes completed and interrupted attempts. Unanswered items are kept separate and are not treated as proof of weakness. AI uses these aggregates to explain weak topics and suggest practice. It does not receive the learner's name, email or password. Changed evidence invalidates the cached study plan.

AI study plans share the existing per-user and global AI quotas with roadmap generation. If AI is unconfigured, unavailable or out of quota, the app labels the fallback as an evidence-based study plan. No new AI key is needed. Use the existing GEMINI_API_KEY and GEMINI_MODEL server settings; learner screens say AI.

New records live under `users/{uid}/assessmentDays/{India-date}`, `users/{uid}/reviews/{competencyId}` and `users/{uid}/reviewPlans/{competencyId}`. Answer indices and question IDs are retained in attempt history. The existing deny-all browser Firestore rules remain appropriate; all access uses authenticated server routes.

Older releases did not retain complete per-attempt answer data. Cumulative evidence starts with attempts recorded by this release; older scores/history are preserved rather than invented or retroactively reclassified. An active attempt from an older policy must restart.

## Browser limitations

This is browser-based focus monitoring, not tamper-proof proctoring. Browsers can suppress or delay visibility/unload events; a browser crash, cleared storage, disabled JavaScript, modified client, another device or another screen cannot be reliably policed by a normal website. Fullscreen must remain escapable through the browser's controls. Mobile and embedded-browser support varies.

The third detected departure disables answering immediately. A network failure may delay the server lock; the client retains its count and retries when the learner reconnects. The server enforces persisted daily counters and reported exits, but it cannot independently observe the user's operating-system tabs. No screen capture, webcam, or keyboard blocking is used.

## Deploy and verify

Deploy the updated source folders to the same Vercel project. `/api/health` should show 1.5.0. No new environment variables or content reseeding are required for a project already on 1.4.0.

On your actual deployment, test: fullscreen denial; two departures and resume; the third departure and daily lock; three normal starts; refresh/resume; offline departure/reconnect; expiry; two browser sessions; and midnight India-time reset. Verify that study evidence includes wrong answers from an interrupted attempt and later completed attempts. Check phone and desktop fullscreen behavior.

Automated tests simulate focus events and external services. Real-browser/device and live Firebase/AI testing require the configured deployment.

References: https://fullscreen.spec.whatwg.org/ and https://www.w3.org/TR/page-visibility-2/.
