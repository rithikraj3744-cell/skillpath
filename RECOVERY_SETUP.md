# Enable email OTP password recovery

Forgot password now supports **email → six-digit code → new password**. The existing Firebase reset-link option remains available. No SMS provider is used.

## Configure your deployed website

1. In Resend, verify a domain you control and create a sending API key. Use a verified sender such as `SkillPath <recovery@your-domain.com>`. Resend's test sender is not a general public-launch sender.
2. Add these **server environment variables** in Vercel → Project → Settings → Environment Variables for the environment you deploy:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your Resend sending API key |
   | `RECOVERY_FROM_EMAIL` | Your verified sender address, optionally with a display name |
   | `RECOVERY_SECRET` | A cryptographically random secret of at least 32 characters |

   Generate the secret locally, for example with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Paste the output into Vercel, not into source files or chat.

3. Give the existing Firebase service account the additional IAM permissions `firebaseauth.users.get` and `firebaseauth.users.sendEmail` in its Firebase project. A custom role containing these permissions keeps recovery access scoped. Keep its existing Cloud Datastore User role. Google Cloud's Firebase Authentication Admin role also includes broader authentication administration permissions; use your organization's approved IAM setup.
4. Keep Firebase Email/Password authentication enabled. Redeploy after saving the variables and IAM permissions. The setup page reports whether the OTP environment values are present; this does not verify delivery or IAM access.
5. On your real Vercel URL, choose **Forgot password?**, use a test email/password account you own, receive the code, verify it, set a new password, and sign in. Check spam and Resend delivery logs if necessary. Verify that the old password no longer signs in. Google-only accounts should use **Continue with Google**.

Without all three environment values, the page offers Firebase's existing password reset email link. With the values present but invalid, the page shows an error; it never pretends a password was changed.

## Behavior and storage

- Codes expire after 10 minutes and allow at most 5 verification attempts. Codes are stored as keyed hashes, never plaintext. Passwords are passed to Firebase, never stored in Firestore or logged.
- A verified code grants a single-use authorization lasting 5 minutes. Concurrent verification or reset requests cannot reuse it. Requesting another code invalidates the earlier challenge.
- Resend cooldown: 60 seconds; maximum 5 requests per email per hour and 100 across the application per UTC day. These limits include unregistered addresses and failed delivery attempts. They bound application sends, not provider billing.
- Start responses are generic for registered and unknown addresses. Codes are sent only to enabled email/password accounts. Provider delivery errors may still be reported.
- Firestore stores `recoveryChallenges` and `recoveryLimits` on the server. Recovery challenges contain the email address until completed/failed; completed resets remove it. Expiry is enforced by code, not automatic deletion. Include expired records and counters in your administrator's retention/cleanup procedure. Never relax the deny-all browser rules for recovery.
- Firebase's authorized reset action performs the password change. A failed or interrupted final request requires a new code; if the outcome is uncertain, first try signing in with the new password.

Tests mock Firebase and Resend. Real email delivery, IAM permissions, domain verification and your Firebase password policy must be checked after deployment.

## Official references

- [Firebase email action links](https://firebase.google.com/docs/auth/admin/email-action-links)
- [Privileged account lookup and IAM permission](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v1/projects.accounts/lookup)
- [Firebase password reset action generation](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/sendOobCode)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
