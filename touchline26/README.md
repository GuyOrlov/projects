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
## Desktop & tablet interface (September 2026)

The primary interface is now a widescreen football-management workspace: persistent left sidebar, enlarged 2D match and tactics pitches, a large central management panel, and a contextual club-information rail on wide desktop screens. At tablet widths the sidebar and full-width main game remain while the optional information rail is hidden. Narrow phone screens deliberately retain a scrollable 900px tablet canvas instead of returning to stacked mobile cards; swipe horizontally to see the entire workspace. Typography remains DM Sans and Barlow Condensed, with high-contrast controls and reduced-motion support. All Phase 3 gameplay, existing saves, live scorer/assist notifications and goalscoring report are preserved.

## Management improvements (23 September 2026)

The existing three-phase prototype now includes the following **local, simulated** improvements:

- Wider desktop match-day view: live pitch, updated statistics, substitutes and commentary in the sidebar; a visible pass route joins the actual simulated players.
- Recorded position-by-position goal build-up replay in the full-time report (step through frames; it is not real video or a physical football simulation).
- Career player profiles and accumulated appearances, minutes, goals, assists, clean sheets, cards and average ratings. Historical matches played before this release cannot be backfilled reliably; tracking starts with new matches.
- Squad depth chart, matchweek-based 38-round calendar, own-club player statistics and two-player transfer-target comparison.
- Optional user-provided player roster JSON import, with name/position validation. The club name must match your selected club. It must contain 11–30 players, including at least 2 GK, 4 DEF, 3 MID and 2 FWD. Data accuracy and reuse rights are the user's responsibility. Imported names are explicitly unverified, while player ratings and financial values remain simulated. Late API responses cannot replace an imported squad.
- Different **fictional AI approaches** (high press, possession, counter-attack or low block), situational changes and simulated opposition substitutions.
- Selectable board priorities for league results, finances or academy promotion.
- Local preferences for text size, contrast and reduced animation. Existing local autosave and JSON backup remain.
- **Important save fix:** Phase 3 staff constants are now initialized before loading an existing career; previously a saved career could fail to load after refresh.

### Remaining limitations

This is an unofficial single-file browser simulation. It does **not** include a verified full 2026/27 squad database, official match statistics, official FA Cup or UEFA fixtures, a fully playable Championship/promotion-and-relegation system, or automatic cloud synchronisation. TheSportsDB's accessible free endpoint may provide incomplete or stale names. There is no secure online identity/storage backend for cloud sync: use **Career & Saves → Export JSON** to move your career manually to another device. The tablet-style canvas is intentionally wide on narrow phones.
