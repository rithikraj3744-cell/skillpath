# SkillPath responsive update

This update adds fluid typography and responsive layouts to the connected app.
It includes the previous launch fixes and keeps the existing Firebase/Gemini API
configuration and database format.

## Deploy to your existing Vercel project

1. Extract this ZIP and open the extracted project folder.
2. Upload its complete contents to the root of your existing GitHub repository,
   replacing matching files and keeping the `public`, `api`, `server`, `scripts`,
   and `tests` folders intact. Do not upload the ZIP itself as the project.
3. Keep your working Vercel environment variables, including the Gemini model
   and API key. No new variable, database reset, or content reseeding is needed.
4. Commit the files and let Vercel deploy. If automatic deployments are disabled,
   deploy the latest commit in Vercel.
5. Open the new production deployment and refresh the page.

## What changed

- Body text scales from 16 to 18 px and regular UI labels from 14 to 16 px at
  default browser settings. Page headings scale from 25 to 36 px. Rem-based bounds
  preserve browser text preferences and zoom.
- A new `public/responsive.css` stylesheet loads after the existing stylesheet.
- Cards and forms use one, two, or more columns as space allows; long headings,
  competency names, AI guidance, and prerequisite tags wrap within their containers.
- At widths of 64 rem and below, navigation opens as a scrollable drawer, with
  a close button, backdrop dismissal, Escape support, and keyboard focus handling.
- Inputs remain at least 16 px at default settings and key touch controls are
  at least 44 px high. Mobile safe-area insets protect bottom controls.
- Tables scroll inside labeled, keyboard-focusable regions. Dialogs fit the
  visible viewport and scroll internally. Graph labels are larger.
- Only frontend presentation, navigation, and asset checks changed. AI request
  logic and Firebase security behavior are unchanged.

## Check before sharing

The JavaScript syntax and deployment asset checks were run. Live visual browser
testing and physical-device testing were unavailable in the editing environment.

- Check widths 320, 390, 768, 1024, 1440, and 1920 px, plus phone landscape.
- On desktop, zoom to 200% and verify navigation, forms, and lesson text remain usable.
- On a phone, open/close navigation, visit each learner page, and focus a form field.
- Open an admin editor and check scrolling, long record names, and save/cancel controls.
- Generate a roadmap using your working Gemini configuration and read the full result.
- Check assessment navigation and horizontally scroll the history/admin tables.

The legacy `/demo.html` is a separate sample; these changes target the real app
at `/`, which is the production learner and administrator experience.
