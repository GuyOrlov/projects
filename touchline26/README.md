# ⚽ Touchline 26 — Phase 3

Independent, mobile-first football management prototype for the 2026/27 season. This release builds on Phase 2's 20-club, 38-round league, real-club names, optional TheSportsDB player-name lookup, and Phase 1's interactive positional match engine.

## New features

- **Touchline National Cup:** original *fictional* 20-club, 19-tie knockout competition with 12 preliminary byes; cup rounds after league matchweeks 4, 12, 20, 28 and 36. User's ties run through the existing 2D match engine. Drawn games use a simple random penalty winner. Cup matches do not change league points or played count.
- **Manager career:** season-end ranking and trophies, reputation, season history, fictional job offers and the option to switch to a new club at season end. Switching clubs creates that club's new squad and budget while retaining manager history.
- **Club staff:** upgrade coaching, medical and scouting staff (levels 1–5); hiring costs and recurring payroll, extra training gains, better recovery/lower injury risk and discounted scouting reports.
- **Board and inbox:** periodic simulated board confidence and expectations updates, job news and cup notifications.
- **Save tools:** the existing browser autosave remains at `touchline26_realclubs_v2`; a manual local checkpoint plus downloadable/importable Phase 3 JSON backup help move a career to another device. *There is no cloud-save service or account synchronisation.*
- **Mobile navigation:** accessible 11-tab grid, ensuring Cups, Staff and Career are visible without horizontal scrolling.

## Limits

Competition structure, fixtures, player ratings, transfers, finances, job offers and scores are entirely game simulations. The Touchline National Cup is **not** the official FA Cup. Licensed FA Cup, League Cup, UEFA competitions, other playable national leagues, true relegation/promotion and cloud storage are **not implemented**. TheSportsDB public API can supply only part of a current squad, and generated players fill any gaps. Club crests and player photos are not officially licensed.

Existing Phase 2 careers load without intentionally deleting any match results or transfer data. For careers already beyond the cup's first scheduled round, the newly introduced cup can start late, as it did not exist in prior saved seasons. Your current squad and budget remain.

## Deployment

Repository location: `GuyOrlov/projects/touchline26/index.html`. GitHub Pages, if already configured to deploy the main branch root, should serve the game at `https://guyorlov.github.io/projects/touchline26/` after GitHub finishes publishing. Save files are stored in your browser and can be exported through **Career**.

Independent fan prototype; not affiliated with real clubs, FIFA, a league, or a commercial football management game.