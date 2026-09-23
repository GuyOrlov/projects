# ⚽ Touchline 26 — Phase 1 (2026/27)

An independent mobile-friendly, single-file football management prototype. Open `index.html` in a browser or enable GitHub Pages for this repository.

## Phase 1 features
1. **Animated 2D match** with illustrative moving players/ball and 90-minute clock; three match speeds.
2. **Live controls:** pause/resume, half-time review, tactics changes and up to five substitutions. Active matches resume paused after refresh.
3. **Draggable tactics:** formation presets, keyboard/touch controls, pressing, width, defensive line and individual balanced/push-forward/hold-position instructions. These affect simulated chance creation and stamina.
4. **Fitness, yellow/second-yellow red cards, suspensions and injuries** across league matches.
5. **Post-match analysis:** possession, shots, shots on target, passes, passing accuracy, tackles, simulated expected goals, player ratings and highlights timeline.

## Existing gameplay retained
Eight real club names, optional real-player name lookup via TheSportsDB with fictional fillers, fantasy eight-team 14-match league, transfers, training, seasons and browser autosave. Ratings, finances, fixture results and match stats are fictional game mechanics. The live pitch animation illustrates the match rather than reproducing realistic ball physics. Player markers for the opponent are not actual squad data.

## Publishing
File path: `GuyOrlov/projects/touchline26/index.html`. To publish if needed, visit repository **Settings → Pages** and configure **Deploy from a branch → main → /(root)**. When confirmed, the expected URL is `https://guyorlov.github.io/projects/touchline26/`. Do not assume the URL is active until GitHub confirms deployment.

Local save key: `touchline26_realclubs_v2`, shared with the prior version; old careers are loaded and given Phase 1 default tactics on startup. Progress stays on the same browser and device. No API secret or server is required. API coverage and browser access may be incomplete; fictional-name fallback keeps the game playable.

Unofficial independent game. Not affiliated with the clubs or any licensed football management title.