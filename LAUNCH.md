# SkillPath 1.5.0 — Deployment checks

Follow UPDATE_GUIDE.md to deploy the ZIP to your existing GitHub/Vercel project and apply Add learning library. The ChatGPT Site copy is separate from your Vercel deployment and its Firebase environment.

1. Check `/api/health` reports 1.5.0. Apply the library update as admin; all starter competencies should have at least 40 questions.
2. Edit a copy of the Excel example, give a question a new prompt, import and refresh the bank. Re-import and confirm it is skipped. Check that missing or ambiguous answer keys are flagged before saving.
3. As a separate learner, choose a career and start an unlocked competency quiz. Confirm 40 questions. Submit correct, wrong and skipped responses; check net marks, pass/fail and saved history.
4. Pass with at least 24 net marks, refresh, and verify prerequisite unlocking. Confirm learners cannot use admin routes or see another learner’s data.
5. Complete RECOVERY_SETUP.md. With an email/password account you own, receive an OTP, verify it, change the password and sign in. Confirm the old password fails. Test expiry, incorrect codes and the reset-link alternative. Confirm Google login still works.
6. Test AI personalization with your configured account/model. Provider errors must not discard saved quiz scores.
7. Check login/signup, module reader, question navigation and import dialogs on phone and desktop, including keyboard navigation. Test interrupted import/library updates and safe retry.

Keep the deny-all browser Firestore rules. Server access is controlled through service-account IAM. No new secret belongs in public JavaScript or source control. This update does not configure your external Firebase, Resend or Vercel accounts automatically.

Automated tests use mocked external services. Live account and browser checks remain the operator’s responsibility; see TEST_REPORT.md.

Also complete the focus-mode checks in ASSESSMENT_FOCUS.md: fullscreen denial, three departures, three starts, refresh/offline recovery, and cumulative AI guidance. Browser visibility signals are best effort, not tamper-proof proctoring.
