# Goal Description

Build a production-ready, client-side conversational survey web application for Resurtech's market and feature validation. The survey will feature a linear step progression with branched paths based on user answers, using a custom hook `useSurveyState`. It will be styled completely with vanilla CSS (no Tailwind) following Resurtech's strict design system. It will integrate directly with a Supabase PostgreSQL backend. The app will be statically exportable (for GitHub Pages).

## User Review Required

> [!WARNING]
> This app will be statically exported for GitHub Pages. Is there a specific Next.js version or any other strict requirements for deployment, or should I proceed with the latest stable Next.js 14?

## Open Questions

> [!IMPORTANT]
> The database requires Supabase environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. I will set up the code to expect these. You'll need to provide these variables (e.g., in a `.env.local` file) or I can set up mock data logic if you prefer to test the UI first. Which approach do you prefer?

## Proposed Changes

### Setup & Infrastructure
We will initialize a Next.js project configured for static export.

### Styling
- Define global CSS tokens in `globals.css` with the specified color palette (e.g., `--void`, `--neon`) and motion easing (`--ease-out-quint`).
- Use vanilla CSS and CSS Modules (if needed) to style the glassmorphic panels and input fields.
- Set typography using Google Fonts (Poppins and JetBrains Mono).

### Supabase Integration
#### [NEW] src/lib/supabaseClient.ts
Initialize the Supabase client using environment variables.

### Custom Hooks
#### [NEW] src/hooks/useSurveyState.ts
A robust state machine hook managing:
- Current step index / screen ID.
- User answers payload (matching the SQL schema).
- Branching logic (`Branch A` for active CAD users, `Branch B` for non-designers).
- Keyboard event listeners for navigation (Enter, 1-5, Shift+Tab).

### UI Components
#### [NEW] src/components/survey/ProgressBar.tsx
Slim top-docked indicator showing progress in `--neon`.
#### [NEW] src/components/survey/KeycapHint.tsx
Small keyboard shortcuts (e.g., Press 1–5, ↵ Enter).
#### [NEW] src/components/survey/QuestionCard.tsx
Animated wrapper handling enter/exit blur and y-axis stagger using Framer Motion (or pure CSS transitions if preferred). Let me know if you want to strictly stick to pure CSS transitions.
#### [NEW] src/components/survey/SurveyContainer.tsx
The main orchestrator housing all screen states and Supabase dispatch logic.

### Pages
#### [NEW] src/app/survey/page.tsx (or src/app/page.tsx)
The entry point rendering `SurveyContainer`.

## Verification Plan

### Manual Verification
1. Click through all branches of the survey to ensure correct routing.
2. Verify keyboard navigation works flawlessly (Enter, numbers 1-5, Shift+Tab).
3. Check the glassmorphic UI against the provided design system tokens.
4. Verify Supabase submit logic triggers appropriately and formats the payload according to the SQL schema.
