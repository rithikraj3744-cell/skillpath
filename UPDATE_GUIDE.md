# SkillPath 1.5.0 — Fullscreen assessments and daily limits

Deploy the updated folders to the same GitHub/Vercel project, then hard-refresh. `/api/health` should report **1.5.0**. No new environment variables are needed. Existing 1.4.0 question banks do not need reseeding.

New behavior: fullscreen entry, departure counter, automatic closure and day-long competency lock on departure three, maximum three starts per competency per India calendar day, autosaved answers, and AI study guidance combining completed and interrupted attempts. Read **ASSESSMENT_FOCUS.md** for precise rules and browser limitations.

Only normal submissions update mastery; early closures feed study guidance. Cumulative answer evidence starts with this release. Existing scores and histories stay intact. Active attempts from older versions must restart under the new policy.

## Earlier 1.4.0 setup (for projects not yet upgraded)

## Update your Vercel project

1. Extract the release ZIP and replace matching files in your GitHub project. Preserve the public/, server/, api/, scripts/ and tests/ folders. Keep your local environment settings; never upload a service-account key or .env.local.
2. Keep Vercel Framework Other, Build Command `node scripts/vercel-build.mjs`, Output Directory public, Node 22.x. Deploy the commit. `/api/health` should report 1.5.0. Hard-refresh your browser.
3. As admin, select **Admin Studio → Add learning library → Apply library update**. Wait for all batches. The update preserves existing records, custom questions and learner scores. Repeat safely if interrupted.
4. A fresh catalog contains 35 competencies, 20 careers, 35 lessons and **1,400 questions** — exactly 40 per competency. Custom competencies need at least 40; Catalog readiness flags shortages.
5. Configure email OTP using **RECOVERY_SETUP.md**. Without sender configuration, Firebase reset-link recovery remains available.

## Assessment rules

Every competency quiz selects exactly 40 questions, shuffles choices, and allows 60 minutes. Banks may contain more than 40. Correct +1; wrong −0.25; unanswered 0. Passing requires **24 / 40 net marks (60%)**. Negative raw marks remain visible; the displayed percentage is floored at zero.

- 27 correct + 13 wrong = 23.75 marks = 59.38%, fail.
- 28 correct + 12 wrong = 25 marks = 62.5%, pass.
- 24 correct + 16 skipped = 24 marks = 60%, pass.

The mixed-career baseline is replaced by a quiz for the next available competency. Learners can choose another unlocked competency. Passing unlocks dependent skills. Old active attempts must restart. Completed scores and history remain unchanged, not retroactively rescored; the new 60% threshold applies to current prerequisite mastery.

## Excel import and account recovery

**Question Bank → Import Excel** reads column headings and the teacher’s supplied answer keys, flags invalid rows, previews questions and imports reviewed records. See QUESTION_IMPORT.md. The example workbook has 40 HTML questions and a Guide sheet. Unchanged examples already exist after seeding, so they are skipped on re-import; edit the prompts to add your own content.

Forgot password supports email → six-digit OTP → new password after RECOVERY_SETUP.md is configured. The login/signup page also includes an original learning illustration and responsive styling. See TEST_REPORT.md for test scope and LAUNCH.md for live verification.
