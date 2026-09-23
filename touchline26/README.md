# Touchline 26 — Phase 2

Unofficial mobile-first football management prototype for 2026/27.

## Play

With GitHub Pages enabled for `GuyOrlov/projects` on `main` from `/(root)`, visit `https://guyorlov.github.io/projects/touchline26/`. A standalone copy can be opened from `index.html` in a modern browser. The live 2D match remains an illustrative simulation, not full football physics.

## New in Phase 2

- All **20 actual 2026/27 English Premier League clubs**, including promoted Coventry City, Hull City and Ipswich Town. A **38-round, 380-fixture** simulated double round robin (19 home, 19 away per club). The game starts a new 2026/27 schedule rather than copying the official calendar.
- Redesigned, higher-contrast interface with **DM Sans** for text and **Barlow Condensed** for sports-style headings (system fallbacks when offline), larger touch targets and horizontally scrollable navigation.
- Existing draggable tactics, animated match pitch, half-time substitutions, training, injuries and analysis retained.
- Scouting, shortlists, **negotiated permanent and season-loan transfers**, weekly salary/contract length, squad contract renewal. Transfer market is fictional; negotiations are gameplay only.
- Youth academy with developing fictional prospects and first-team promotion (age 17+).
- Club-finance screen including simulated revenues, wage cap, wages, reserves, sponsor allocations and academy/scout upgrades.
- Expanded player profiles with age, nationality, shirt number (where available), simulated potential, wage and contract. Optional TheSportsDB free API fetch for selected club names; free API limits coverage (up to 10 players/team) and availability can vary. Remaining players are fictional and explicitly marked only API-sourced names REAL.

## Known boundaries

- Match schedules, outcomes, strength ratings, transfer valuations, club balances, wage budgets, match stats and academy players are all **simulated**. They are not official or verified values.
- The Premier League table marks places 18–20 as the relegation zone, but **cross-division promotion/relegation between seasons is not implemented yet**. Later game seasons retain the same 20 teams.
- The free sports API does not guarantee complete, current squad data for all clubs. The game remains playable with generated players when it fails.
- The app uses local browser storage, not cloud sync. Keep browser site data to preserve your career.

## Phase 1 save migration

Phase 1's eight-team league cannot be mapped honestly to a 20-club, 38-round season. On first launch of Phase 2, the game saves a backup of the old career in browser storage under `touchline26_realclubs_v2_legacy_backup`, retains your selected club, squad and transfer budget, then starts a fresh 2026/27 20-club league. An active unfinished Phase 1 match is not continued in the new format. Clearing browser data deletes both copies; for long-term archival, export your browser data before clearing it.

No real club trademarks, crests or photographs are bundled. All club/player names are used for identification in an unofficial independent prototype. TheSportsDB is credited as optional player-name source. The site uses the free API key only; never publish paid API keys in a public static repository.

## Match-engine positioning fix (September 2026)

The live 2D match now uses a spatial, possession-based simulation rather than randomly moving the ball independently of players. The current ball carrier is highlighted; one pass is simulated and shown per logical match-minute, with its endpoint attached to the actual receiver or interceptor. Players make modest supporting runs from the customised tactical shape. Interceptions and successful passes update actual possession, and substitutes inherit the outgoing player's on-pitch location. A match already saved under the previous version is upgraded in-place and resumes paused. The match remains an *illustrative* lightweight simulation, not realistic physics or live football tracking.