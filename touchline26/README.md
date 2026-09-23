# ⚽ Touchline 26 — Manager Edition

Independent desktop/tablet football-management browser game. Choose a club in the fictional 2026/27 20-team Premier League or 24-team Championship simulation; manage the club across seasons with promotion and relegation. The original Phase 1–3 live 2D match engine, transfers, academy, cup, finances, club staff and local career saves are retained. Club names reflect the specified season, but game-generated players, results, costs and international competition outcomes are simulated.

## New features

- **Touchline National Cup:** original *fictional* 20-club, 19-tie knockout competition with 12 preliminary byes; cup rounds after league matchweeks 4, 12, 20, 28 and 36. User's ties run through the existing 2D match engine. Drawn games use a simple random penalty winner. Cup matches do not change league points or played count.
- **Manager career:** season-end ranking and trophies, reputation, season history, fictional job offers and the option to switch to a new club at season end. Switching clubs creates that club's new squad and budget while retaining manager history.
- **Club staff:** upgrade coaching, medical and scouting staff (levels 1–5); hiring costs and recurring payroll, extra training gains, better recovery/lower injury risk and discounted scouting reports.
- **Board and inbox:** periodic simulated board confidence and expectations updates, job news and cup notifications.
- **Save tools:** the existing browser autosave remains at `touchline26_realclubs_v2`; a manual local checkpoint plus downloadable/importable Phase 3 JSON backup help move a career to another device. *There is no cloud-save service or account synchronisation.*
- **Original Phase 3 mobile navigation (later replaced by the desktop/tablet sidebar):** accessible 11-tab grid, ensuring Cups, Staff and Career are visible without horizontal scrolling.

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

This is an unofficial single-file browser simulation. It does **not** include a verified full 2026/27 squad database, official match statistics, official FA Cup or UEFA fixtures, a playable League One, or automatic cloud synchronisation. TheSportsDB's accessible free endpoint may provide incomplete or stale names. There is no secure online identity/storage backend for cloud sync: use **Career & Saves → Export JSON** to move your career manually to another device. The tablet-style canvas is intentionally wide on narrow phones.

## Playable Championship and promotion/relegation (23 September 2026)

- Two 2026/27 divisions, selectable at career creation: **20 Premier League clubs** (38 league rounds) and **24 Championship clubs** (46 league rounds). Actual club names/membership were checked against Premier League and West Bromwich Albion's published 2026/27 lists. All fixtures, match results, powers and money in this game are simulated rather than imported real-world schedules.
- The other division is simulated as you play and has a separate, browsable league table. A manager may continue with the same club over multiple seasons.
- At full season completion, Premier League positions 18–20 are relegated. The Championship's top two are promoted automatically. The third promotion spot comes from the **six-club 2026/27 play-offs**: fifth v eighth and sixth v seventh (one-leg eliminators); third and fourth have semi-final byes, with third playing the lowest-ranked surviving club; semi-finals are two-legged, final is one-legged. **Play-offs are auto-simulated**, including your own club if applicable; drawn play-off ties are decided by a game-simulated shoot-out. The end-of-season panel shows promoted/relegated clubs and play-off results.
- **Save migration:** Original 20-team careers retain their club ID, squad, current round, results, finances and match stats. The Championship is added as a new background league. The existing `touchline26_realclubs_v2` localStorage key remains. Existing eight-team mini-league backup behaviour is retained. A former Premier League club that is relegated switches to the Championship with the same manager/squad; promoted Championship clubs move into the Premier League the next season. Career history records the division.
- The prior fictional **Touchline National Cup** remains a 20-club invitational simulation for each new season. For a Championship manager not in the selected Premier League group, their club is invited as a replacement; existing in-progress cup draws are preserved.

**Scope:** A playable League One and relegation from the Championship into League One are not modelled; Championship's bottom three remain in the current 24-club simulation. Real-world squad APIs may provide incomplete or outdated player lists, and no official Championship schedule, FA Cup or cloud save backend has been connected. The football data and promotion outcomes generated *inside the game* are fictional.

## Manager Edition — expanded management (23 September 2026)

Seven feature areas have been added on top of the original three phases:

1. **Advanced tactics and specialist roles:** short/mixed/direct passing, attacking focus through centre or flanks, goalkeeper distribution, selectable main attacking threat and creative outlet. Position-specific roles include sweeper keeper, ball-playing defender, attacking full-back, playmaker, ball-winner, winger, poacher, target forward and pressing forward. Roles and selected players affect simulated pass targeting, off-ball positioning, chance creation and stamina. The draggable tactics pitch remains. The movement is illustrative; there is no fully physical football engine.
2. **Transfer market:** seven game-generated free agents per season (zero transfer fee, wage cap enforced), AI clubs removing some available transfer targets while preserving your scouted players and shortlist across matchweeks, periodic restocking of the fictional market, an optional first-window restriction for the opening five rounds, and buy-and-loan-back deals where a signing joins the following season. Transfer fees, agents and rival transfers are simplified game simulations.
3. **Coaching:** attacking, defensive, goalkeeping, fitness and youth specialists (levels 1–5); selectable once-per-round training focus; progressive Bronze, Silver and Gold manager qualifications based on season experience and simulated training costs. Specialist payroll is charged through club finances.
4. **Match engine:** additional dribbling/tackling decisions, position-role movements, on-target goalkeeper saves, recorded goal build-up frames, live scoring and assist alerts, and a wide desktop match-day sidebar with statistics and substitutes.
5. **International career:** apply for one of eight generated national squads, choose an XI, and play six simulated friendlies around the club calendar. After six friendlies, a fictional four-nation **Touchline International Invitational** with semi-finals and a final becomes available. This is *not* an official international or FIFA tournament, nor a live 2D national-team engine.
6. **Assistant/scouting:** generate a current-round assessment of your squad's weakest position, top starter, your opponent's simulated tactical approach and club reserves. Existing scout and transfer comparison screens remain.
7. **Manager jobs/inbox:** filtered and unread board, transfer, scouting, career and international messages; job interviews, voluntary resignation between seasons and an unemployment state that requires accepting a new job to continue. Existing league objectives and career history remain. There is no complex contract system, press conference, automatic dismissal or real-world job-vacancy service.

**Compatibility:** The browser save key remains `touchline26_realclubs_v2`, and the export/import format remains version 3. Older 20-team careers migrate without resetting league results, points, budget or players. New fields receive conservative defaults; statistics predating their introduction cannot be reconstructed. Keep a JSON backup in Career & Saves before experimenting. Cloud sync remains unavailable; GitHub Pages does not supply a secure identity and save backend.
