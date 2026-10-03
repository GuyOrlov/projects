# UK Disability Data Hub

Access to Data is an accessible, source-linked UK disability statistics website.

## Current build

The dashboard now follows the Figma layout in:

https://www.figma.com/design/nelY12uMGnGGRM8QPSBqPY

The implementation is deliberately split into:

- index.html — semantic page structure
- styles.css — responsive desktop/mobile presentation
- app.js — data loading, filters, accessible chart/table switching and ECharts
- data/dashboard.json — dashboard values and metadata
- data/sources.json — source registry and automation metadata
- data.csv — downloadable flat data

## Chart layer

Charts are rendered with Apache ECharts in the browser. The numbers are not hard-coded into the chart configuration; app.js reads the JSON data files and builds the charts.

Every chart also has a table view so the information is available without relying on colour or graphics alone.

## Data model direction

Each metric should retain:

- measure and value
- unit
- geography
- population coverage
- period
- source
- definition
- publication/update metadata
- last checked date
- quality or comparability notes where needed

Survey estimates, census counts and administrative caseloads should remain distinguishable.

## Automation roadmap

Phase 1: maintain clean JSON/CSV files while the data model stabilises.

Phase 2: use GitHub Actions to check known official releases/APIs, update raw and normalised data, validate changes and commit refreshed public data.

Phase 3: move the clean data layer to Supabase/Postgres only when dataset size, filtering or API requirements justify it.

## Main source families

- DWP Family Resources Survey
- DWP Employment of Disabled People
- ONS A08 labour market dataset
- DWP Personal Independence Payment statistics
- DWP Stat-Xplore
- UK Government BSL reports
- ONS Census language data
- Scotland Census
- NISRA Census

The source registry is stored in data/sources.json.
