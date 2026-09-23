# Touchline 26 — real-club prototype

Mobile-friendly, unofficial football management mini-game for 2026/27. Open `touchline26/index.html` through GitHub Pages (or in a browser). 

## Features

- Eight real English club names: Aston Villa, Arsenal, Liverpool, Manchester City, Manchester United, Chelsea, Newcastle United and Everton.
- Three formations (4-4-2, 4-3-3, 3-5-2), with a drag-and-drop tactical pitch supporting touch, mouse and keyboard arrows.
- Fictional 14-round, eight-club mini-league, simulated scores, fictional transfer market, training, injuries and local autosave.
- Optional, automatic real-player **name** lookup for your selected club from [TheSportsDB v1](https://www.thesportsdb.com/documentation). The public free endpoint currently returns up to 10 players per team; synthetic development players fill gaps. The provider's data may be incomplete, stale or blocked by browser cross-origin restrictions.
- Ratings, budgets, player fitness, morale, transfer fees and match results are entirely **game mechanics**, not verified real-world player statistics. Opponent squads and transfer market remain fictional.

## Publish using GitHub Pages

Repository: `GuyOrlov/projects`. In the repository, choose **Settings → Pages → Build and deployment → Deploy from a branch**, select **main** and **/(root)**, then Save. Once deployment is confirmed, the game should appear under `https://guyorlov.github.io/projects/touchline26/`. Do not assume the URL is active until GitHub displays a confirmed deployment. No secret or paid API key is needed.

## Save data and API use

Local storage key: `touchline26_realclubs_v2`. Saved careers stay in the same browser unless site data is cleared. Roster sync is intentionally limited to before the first match; refreshing it replaces starting players. API requests are sent directly to TheSportsDB only when starting a new club or choosing **Refresh real player names**. If API requests fail, game-generated players remain usable.

Independent fan prototype; not affiliated with football clubs or a football game publisher. No official logos, player photos or protected game assets are included.
