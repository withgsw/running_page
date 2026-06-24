# AGENTS.md — running_page

## Project overview

Personal running homepage. Python scripts sync workout data from Strava / Garmin / Nike / Keep / etc. into a SQLite DB, then a React + Mapbox frontend displays it. Deployed via Vercel or GitHub Pages.

## Commands

```sh
# Frontend dev (localhost:5173)
pnpm dev

# Build (output -> dist/)
pnpm build

# CI pipeline order: pnpm check -> pnpm lint -> pnpm build
pnpm ci

# Formatting — JS/TS via prettier, Python via black
pnpm format
black .

# Python deps
pip install -r requirements.txt
```

## CI (ci.yml)

Runs on push/PR. Two matrix jobs:
- **Python** (3.12–3.14): `pip install -r requirements-dev.txt`, smoke-test `gpx_sync.py`, `black . --check`, `ruff check .`
- **Node** (20, 22): `pnpm install`, `pnpm check`, `pnpm lint`, `pnpm build`

## Data sync workflow (run_data_sync.yml — daily + manual)

Set `RUN_TYPE` env to one of: `strava`, `nike`, `garmin`, `garmin_cn`, `keep`, `coros`, `only_gpx`, `nike_to_strava`, `strava_to_garmin`, etc.

Post-sync: auto-generates `assets/github.svg`, `assets/grid.svg`, `assets/github_<year>.svg`, circular SVG, and month-of-life SVGs.

## Key files

| File | Purpose |
|---|---|
| `src/utils/const.ts` | Mapbox token, styling, i18n (`IS_CHINESE`), privacy mode |
| `src/static/site-metadata.ts` | Site title, URL, logo, nav links |
| `run_data_sync.yml` (env block) | `RUN_TYPE`, `ATHLETE`, `TITLE`, privacy, cache toggles |
| `run_page/gen_svg.py` | All SVG generation (`--type github/grid/circular/monthoflife/year_summary`) |

## Gotchas

- **No tests.** CI only smoke-tests `gpx_sync.py`. No JS tests at all.
- **No typecheck in CI.** `tsconfig.json` has `strict: true` but `tsc` is never called.
- **First Strava sync** requires editing `strava_sync.py` line 12: change `False -> True`, run, then revert to `False`.
- **Garmin auth** requires generating a secret string via `python run_page/get_garmin_secret.py <email> <password>`.
- **PATH_PREFIX** env var controls the base path at build time. Especially relevant for GitHub Pages deployment (see `gh-pages.yml`).
- **Elevation Gain migration** for existing forks: run `python run_page/db_updater.py` to add column; set `SHOW_ELEVATION_GAIN = true` in `const.ts`.
- **Privacy**: `IGNORE_START_END_RANGE`, `IGNORE_RANGE`, `IGNORE_POLYLINE` env vars; set `IGNORE_BEFORE_SAVING` to filter before DB write.
- **Data cache**: `SAVE_DATA_IN_GITHUB_CACHE=true` keeps data in Actions cache instead of committing to git.
- **Formatter**: Python uses `black .` (not ruff formatter); JS/TS uses prettier.
- **Map token**: Do not use the default public token — replace with your own Mapbox token and apply URL restrictions.
