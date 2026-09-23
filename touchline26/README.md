# ⚽ Touchline 26 — Manager Edition

Independent desktop/tablet football-management browser game with **120 selectable clubs across six playable club leagues**: England's 20-team Premier League and 24-team Championship, plus four additional **fictional national leagues** for Spain (20 clubs), Germany (18), Italy (20), and France (18). England retains promotion and relegation; fictional foreign leagues have their own independent seasons and simulated titles, with no cross-country promotion. The original 2D club match engine, transfers, academy, cup, finances, club staff and local career saves remain. English club names use the original game's 2026/27 list; foreign club names and all generated players, results and finances are fictional.

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

## Manager Edition follow-up — deeper simulation (23 September 2026)

After the seven-area Manager Edition update, the following **additional, fictional mechanics** were built:

- **Club 2D match engine:** defences can intercept passes along the *passing lane*, rather than choosing only the player nearest the intended receiver. Incomplete passes can be recovered as loose balls, and goalkeepers adjust position towards the shot lane. The ball is kept with its actual simulated carrier. The match remains an illustrative two-dimensional simulation rather than a physics-accurate football game.
- **AI transfer competition and negotiating:** other clubs place game-simulated fee and wage offers on available targets. Rival bids remain open for two matchweeks; meeting the counteroffer can secure the signing, or the AI club eventually completes its bid. The normal transfer negotiation enforces both wages and the 30-player squad limit; instant buying can no longer bypass these checks. Generated players and prices are not real-world data.
- **Scouting depth:** a player dossier presents four position-specific *stable, game-generated* attributes, rival interest, a potential band and scout confidence. Commissioned reports are stored in a capped scouting archive. Prior reports cannot be retroactively reconstructed.
- **Manager contracts:** contract expiry year, simulated annual salary, renewal count and a job-security warning are visible under Career. A season-end review renews qualifying contracts or may automatically dismiss the manager following sustained weak confidence and results. Dismissal moves the career into the existing interview/unemployment workflow. It is not a real-world football contract system.
- **Fictional Regional Shield:** a separate four-nation qualifying group with three score-only fixtures per team and a simulated final for the top two includes table, matchweeks and historical results. It coexists with the existing six simulated friendlies and fictional International Invitational. **No international fixture uses the live 2D engine** and no official FIFA/UEFA tournaments or schedules are represented.

**Save compatibility:** The existing `touchline26_realclubs_v2` key and version-3 JSON export remain. Old saves receive safe defaults for contract, recruitment and qualification data without altering squad, results or budget. Back up your career using Career & Saves → Export JSON before major upgrades.

**Verification:** JavaScript parsing, deterministic transfer/contract and qualifier checks, a full 90-minute club match with position/ball invariants, and loading a prior save succeeded in the development checks. A visual inspection of the *hosted* GitHub Pages version on real desktop/tablet screen sizes was not possible from the available browser environment. A full realistic physics engine, real official player data, live international matches, and cloud synchronisation are **not** implemented.

## LMA-inspired expansion — six leagues and business management (23 September 2026)

The newest version adds all seven requested LMA-inspired development areas:

1. **Stadium expansion:** buy 5,000 extra seats (up to 100,000) and upgrade facilities through Finances. Costs come from simulated club reserves, and running costs change with capacity.
2. **Ticket pricing and attendance:** choose a £10–£90 adult ticket; projected attendance varies with price, capacity, club strength, form, board confidence and facilities. Gate income updates after home league or cup games, with a matchday finance breakdown. This is an invented economic model.
3. **Instant-result club matches:** choose *Play live* or *Instant result* on Home, and optionally skip the remaining minutes from a live match. Club cup ties also support instant simulation. Instant matches use the same spatial passes/shots/ratings/goal and assist records and full-time report without showing each minute. **International fixtures remain score-only and never use the 2D match engine.**
4. **Normal / Expert difficulty:** available in Settings. Expert increases simulated opposition ability and scout cost. Switching difficulty does not reset a career.
5. **Responsibility modes:** Coach, Manager and Director presets in Settings; choose which club tasks are delegated: training, scouting and free-agent signings. Delegated tasks run automatically ahead of a club match (or manually once per matchweek), respecting budgets and transfer restrictions.
6. **Manager skill allocation:** earn initial development points plus two on completing a season, then allocate Motivation, Coaching, Judgement and Discipline in Career & Saves (maximum 5 per skill). These affect morale, development, club passing and card likelihood respectively.
7. **Four additional playable national club leagues:** Spain (20 fictional clubs), Germany (18), Italy (20) and France (18). Choose any country and club at career creation and manage a full home-and-away season (38 or 34 rounds). Browse all six live-updating league tables; each division runs in the background during your career. Careers, club-switching offers, local saves and end-of-season advancement are retained. England's Premier League–Championship promotion/relegation continues separately. Foreign clubs have **fictional** names, squads, financial values and results; the sports API is disabled for those clubs to avoid implying official 2026/27 squad accuracy.

**Compatibility and limitations:** Previous careers continue under `touchline26_realclubs_v2`; the game adds safe defaults to their stadium and skills and adds foreign leagues without resetting their original English results. The JSON export remains version 3. This is an independent fan-game simulation, not the official Codemasters LMA Manager. A physical football engine, fully licensed overseas clubs, real official schedules, League One, cloud saves and a true cross-country promotion system are not included. A fresh visual check of the live deployed site on a real desktop/tablet has not been independently completed.

## Matchday experience expansion — stories, highlights and challenges (23 September 2026)

This release focuses on a more enjoyable **club management game** rather than adding another division or changing the technology stack:

- **Pre-match briefing and team talk:** Home displays opposition recent form, simulated style and strength, fatigue and high-stakes context (selected derbies, late-season close-rank meetings and cup knockout rounds). Choose an optional calm, inspiring or demanding talk. The talk is saved by matchweek and has modest effects on club match probabilities and starting-player morale.
- **Live tactical feedback:** a tactical briefing in the matchday side rail explains selected pressing interceptions, direct balls intercepted, short passing, high-quality chances and assistant-initiated changes. The assistant can suggest and apply attacking/defensive mentality changes or open the substitution panel after pausing. Live players still move on the same simulated spatial pitch.
- **Recorded highlights after live or instant results:** goals, on-target saves and opportunities capture a limited number of real *simulation snapshots*. Full time offers an event selector, frame-by-frame stepping and a short automatic play/pause mode (650 ms per frame). If a match has no eligible shots, the final possession phase is available as a fallback highlight. **These are recreated 2D snapshots, not real match footage.** Existing goal-specific build-up replays are retained.
- **Player personalities and conversations:** current squad members receive stable fictional personality/expectation labels. An occasional unused-player request offers a playing-time promise or refusal. Promises are checked three league rounds later against appearances and affect morale; statuses persist.
- **Rivalries and fan reactions:** selected named local rivalries and late-season matches have a distinct briefing; supporters react to results, derbies, cup progression and ticket prices. Happiness appears on Home, Club History and full-time reports and feeds into the stadium attendance forecast.
- **Transfer stories:** a generated agent briefing describes player priorities and reports an existing rival transfer offer and deadline within the established transfer negotiation screen.
- **Season challenges:** eight league wins, five clean sheets and an academy promotion earn simulated transfer-budget and manager-reputation bonuses once per season. Progress appears on Home and Career.
- **Club history:** a dedicated navigation screen records selected standout results, best victory, current squad’s career goals/appearances and archived season challenge progress. Historic matches played *before* this release cannot be reconstructed. Career and season data are retained when changing clubs.

**Compatibility and verification:** New fields migrate lazily into existing version-1 game states without changing the persistent key `touchline26_realclubs_v2` or JSON export format. Test runs confirmed the pre-match team talk, instant match and saved highlights, play/pause and manual frame advancement, a complete live 90-minute match with ball-at-carrier invariants, fan reactions, a playing-time promise, academy challenge, old-save migration after removing new fields, Championship season completion and subsequent Premier League promotion. The site has not been independently viewed on an actual user's desktop/tablet. International fixtures remain **score-only**; the new highlights cover club matches only.

## Matchday Experience — gameplay update (23 September 2026)

- **Pre-match briefing:** opposition form and play style, fixture stakes (including designated derbies, knockout ties and late-season close-table meetings), fitness warning, optional calm/inspire/demand team talk. The selected talk affects the club match simulator.
- **Live-match assistant:** situation-aware substitution, attacking or defensive suggestions, plus text describing tactical effects and interceptions. Only club matches use the 2D engine.
- **Recorded match highlights:** live **and instant** club matches store short positional snapshots for goals, saves and high-quality chances. The match report includes a selectable frame-by-frame 2D highlight view. These are saved simulation frames, not video or a full animation; prior match reports cannot retroactively gain the snapshots.
- **Player personalities and conversations:** simulated personality labels and opportunities/contract expectations. Occasional bench players request appearances; the manager can promise or decline, with morale changes when promises are kept or broken.
- **Fan reactions and stakes:** supporters react to results, derbies, cup victories and ticket prices. Supporter happiness is persisted with the career.
- **Season challenges:** win eight league matches, keep five league clean sheets, and promote an academy player. Completing an objective grants a fictional board bonus.
- **Career history:** memorable matches, biggest win, current player goal/app records and completed season summaries in a Club History screen.
- **Transfer story:** the agent's game-generated motivation and any active rival bid are shown on the offer screen.

**Compatibility and scope:** The existing `touchline26_realclubs_v2` save key, existing English and fictional national club leagues, and score-only international games remain unchanged. Existing saves receive new experience defaults. The original saved league results, squad and funds are preserved in the tested migration. The new events are game-generated and do not represent actual club, player or fan statements.

**Verification:** JavaScript syntax checked, pre-match/team-talk to instant full-time and highlight navigation exercised, player request and club history displayed, persistence tested, and a pre-update Championship save was loaded and advanced. Hosted-device visual validation remains outstanding.
