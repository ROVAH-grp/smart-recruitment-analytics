# Phase H - Front-end screens for the automated hiring pipeline

This connects every new backend feature (Phases A to G) to the RecruitFlow web app. **No new npm packages. No backend changes.**

## What each person now sees
| Who | New page (in the left menu) | What they can do |
|---|---|---|
| **Candidate** | **My Journey** | Apply for a job, accept or decline an invitation, upload a resume, watch their progress timeline, **pick an interview time**, **accept or decline an offer**, download the offer letter PDF, withdraw |
| **Recruiter / Admin** | **Hiring Pipeline** (6 tabs) | **Overview** (funnel, stuck applications, what needs attention), **Applications** (open any application: AI report, decide, open interview rounds, enter scorecards, **Confirm Hire**), **Invitations**, **New hires** (mark joined, reset login), **Activity** (every change and every email), **Automation** (status and "Run now") |
| **Admin** | **Staff Accounts** | Create a recruiter login; the recruiter gets an activation link by email |
| **Employee** (new role) | **My Dashboard** | Employee ID, joining countdown, onboarding checklist, change the temporary password, download the offer letter |

Links in the emails now open the right screen: `/offers/<token>`, `/interviews/<id>`, `/invitations/<token>` (the candidate signs in and lands on that card), and `/reset-password?token=...` or `/activate?token=...` (the password screen opens with the token filled in).

## Install (3 steps)
1. **Copy files:** copy `src/` over `frontend/src` (merge / replace). It adds 14 new files and replaces 8 existing ones: `App.tsx`, `api/auth.ts`, `api/client.ts`, `components/Navbar.tsx`, `components/Sidebar.tsx`, `pages/ForgotPassword.tsx`, `pages/Register.tsx`, `pages/ResetPassword.tsx`. If a teammate changed those too, compare with `git diff` first.
2. **Make the email links open your app.** In `backend/.env` set `APP_URL` to the address where the front end runs (Vite normally uses `http://localhost:5173`), then restart the backend:
   ```
   APP_URL=http://localhost:5173
   ```
3. Start the front end as usual (`npm run dev`). If you use the old `EXPOSE_RESET_TOKEN=true` setting in the backend `.env`, you can remove it: the forgot-password page now works with the emailed link.

## What changed in the existing pages (and why)
- **Forgot / reset password:** the server no longer returns the reset token (a security fix in Phase G), so the page tells the person to open the email. The reset page also works as the **account activation** page for new recruiters and employees, and asks for 8+ characters with a letter and a number.
- **Register:** only candidates can sign up (recruiters are created by an admin).
- **Sidebar / App:** new menu section "HIRING AUTOMATION" with the pages above, new **Employee** role, and the landing page for employees.
- **API client:** a helper that downloads PDFs with the login token.

## Try it (about 10 minutes)
1. **Admin:** sign in, open **Staff Accounts**, create a recruiter login. In the Mailtrap inbox open "Activate your account" and click the button: the activation page opens. Choose a password and sign in as the recruiter.
2. **Candidate:** register with a candidate ID, open **My Journey**, apply for a job, upload a resume.
3. **Recruiter:** open **Hiring Pipeline > Applications**, press **Manage** on that application, shortlist it, then **Open the Technical round** with two time options.
4. **Candidate:** the email arrives; click it (or open My Journey), **Confirm this time**.
5. **Recruiter:** in the application, **Enter scorecard** (for example 80, 70, 75). Open the HR round, let the candidate book it, score it. The application becomes **Selected**.
6. **Recruiter:** **Confirm hire** with a pay amount and joining date. The offer email arrives with the PDF.
7. **Candidate:** **Accept offer**. The page shows the new **employee ID**. Mailtrap has the welcome email.
8. **Employee:** sign in with the work email from the welcome email, open **My Dashboard**, tick onboarding tasks, change the password.
9. **Recruiter:** check **Overview**, **Activity**, **New hires** (Mark joined) and **Automation > Run now**.

## Good to know
- The bell icon notifications in the top bar and the small numbers next to some sidebar items were already placeholder values in the original app. They are not connected to real data yet.
- Screens that list jobs or recruiters read all pages (the server allows at most 100 rows per request).
- `optional-tests/` holds the browser-style tests used to check these screens against the real backend (10 tests passed). They need `vitest`, `jsdom` and `@testing-library/react`, so skip them unless you want to run them.
