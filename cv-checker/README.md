# ClearCV workspace redesign

Three stages: Upload, Review, Improve. Document evidence highlights, category count bars, three summary cards, explicit accept/keep editing, text-based document preview, print-to-PDF, display controls, and on-device AI are implemented.

Checks are deterministic and explicitly labelled. When a job advert is pasted, ClearCV now produces a local CV-to-job match score with a weighted breakdown, recognised essential/desirable terms, missing-wording warnings and a next-action label. The score is a heuristic text-fit measure, not a hiring probability or recruiter prediction. Essential/desirable detection is also heuristic, so the UI tells users to verify the advert manually. Evidence highlights indicate text-pattern matches only. Before/after suggestions use simple wording rules unless the user explicitly runs on-device AI.

Hosted AI is NOT enabled. GitHub Pages cannot run a secret-bearing API. No CV is sent to a hosted model. Launching hosted AI requires a separate backend, a configured model provider, server-side keys, abuse limits, a spending cap, and an explicit user-facing consent/privacy update. Do not put a provider key in browser code. The user's existing unrelated Netlify project has not been modified.

Verification: syntax and DOM integration checks covered the step flow, three dashboard cards, editor initialization, rewrite acceptance, final preview, high contrast and clearing. On-device model inference still requires compatible device testing.


ClearCV 4 adds the job-fit workflow intended to reduce time spent on low-fit applications. Weighting prioritises recognised essential terms (40%), recognised job skills (25%), desirable terms (10%), role-language overlap (15%) and CV evidence signals (10%), with unavailable categories excluded from the denominator. Missing recognised essential terms cap the score so a high percentage cannot hide a must-have wording gap.
