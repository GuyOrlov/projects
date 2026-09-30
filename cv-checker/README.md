# ClearCV workspace redesign

Three stages: Upload, Review, Improve. Document evidence highlights, category count bars, three summary cards, explicit accept/keep editing, text-based document preview, print-to-PDF, display controls, and on-device AI are implemented.

Checks are deterministic and explicitly labelled. No hiring probability, grammar score, or genuine requirements assessment is claimed. Evidence highlights indicate text-pattern matches only. Before/after suggestions use simple wording rules unless the user explicitly runs on-device AI.

Hosted AI is NOT enabled. GitHub Pages cannot run a secret-bearing API. No CV is sent to a hosted model. Launching hosted AI requires a separate backend, a configured model provider, server-side keys, abuse limits, a spending cap, and an explicit user-facing consent/privacy update. Do not put a provider key in browser code. The user's existing unrelated Netlify project has not been modified.

Verification: syntax and DOM integration checks covered the step flow, three dashboard cards, editor initialization, rewrite acceptance, final preview, high contrast and clearing. On-device model inference still requires compatible device testing.
