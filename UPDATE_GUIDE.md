# SkillPath 1.2.0 — Google access and learning update

## Apply the update

1. Extract the complete ZIP. Replace the matching files in your existing GitHub
   repository, preserving the `public`, `server`, `api`, `scripts`, and `tests` folders.
2. Delete `public/demo.html`, `public/demo.css`, and `public/demo.js` from the
   repository if they remain. The Vercel build also removes those retired files
   from the published output when an upload overlays an old checkout.
3. Keep your existing working Vercel environment variables. The internal names
   `GEMINI_API_KEY` and `GEMINI_MODEL` remain unchanged for compatibility; the app's
   buttons, guidance labels, and error messages say **AI**.
4. Deploy the latest commit. `/api/health` should report version `1.2.0`.
5. In Admin Studio, choose **Add learning library**, then **Add missing learning
   content**. This adds the new catalog records to your own Firestore database.
   It preserves records with matching IDs, learner profiles, scores, and history.

## Enable Google login/signup in Firebase

1. Open your Firebase project → Authentication → Sign-in method → Google.
2. Enable the provider, select your project's support email, and save.
3. In Authentication → Settings → Authorized domains, add the exact hostname of
   your production Vercel/custom domain, without `https://` or a path. Add each
   preview hostname you intend to test separately.
4. Keep `FIREBASE_AUTH_DOMAIN` equal to the authDomain from your Firebase Web app
   configuration (normally your project's `firebaseapp.com` domain). Do not
   substitute the Vercel hostname just because the website is deployed there.
5. Open the deployed login page in a normal browser tab and choose **Continue with
   Google**. A first login creates the Firebase account and learner profile;
   returning users keep their existing profile and progress.

Both the sign-in and signup pages offer Google and email/password access. Google
sign-in uses a popup initiated by the button click. Allow popups for the site if
the browser blocks it. For embedded browser restrictions, open the site in the
device's normal browser. No additional email, contacts, or Drive access is requested.
Administrator privileges still depend on the authenticated Firebase UID being
listed in `ADMIN_UIDS`.

Reference: https://firebase.google.com/docs/auth/web/google-signin

## Learning features

- 5 career paths: Full Stack, Frontend, Backend, Data Analyst, Applied AI Developer.
- 23 competencies, 23 lessons, and 57 questions in the bundled teaching library.
- New lessons include worked examples, practice activities, and reference links.
- A next-study sprint points to an available competency based on actual scores.
- Milestones reflect recorded assessments and mastery, without fabricated activity.
- Career discovery cards select a goal; the learner explicitly saves to apply it.
- Assessment choices are shuffled while their server-owned answer mapping is retained.

The library is introductory learning material. Extend it with your course-specific
lessons and a larger assessment bank before treating scores as a high-stakes credential.

## Guidance and reliability fixes

- The guidance card no longer stretches to match a long score list.
- Learners who have assessment history receive score-based guidance instead of a
  generic instruction to take a baseline assessment again.
- AI failures remain visible beside the generation button. Saved scores and the
  skill-based roadmap continue to work.
- One bounded retry handles temporary upstream failures. Authentication, quota,
  and model errors receive actionable messages without exposing provider details.
- Configuration whitespace and a leading `models/` prefix are normalized.
- Cached plans are invalidated when the configured model changes.
- Completed pathways do not spend AI allowance generating empty plans.

## Verification

See `TEST_REPORT.md` for automated coverage and the remaining live checks. A
successful mocked-provider test does not confirm access to your actual AI account.
Firebase provider activation and a production Google sign-in must be checked after
you enable Google and deploy this update.
