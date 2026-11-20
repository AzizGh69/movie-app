# movie-app (TP-3, Angular 22) — Delivery Plan

## Context
The TP-3 subject (`D:\Downloads-d\tp_3.pdf`) asks for an Angular app `movie-app` that consumes the TMDB API. Topics graded: **APIs, HTTP requests, routing, observables**. We deliver it with git, one branch per section of the subject.

Repo: this git repo (`main`). Comparison with a friend's project and the teacher's published solution is done (below); next is Step 0 (API key + Postman), then M1.

## Step 0 — API & Postman (before any code; "Outils de travail" in the subject)
1. **TMDB account + API key:** sign up on themoviedb.org → Settings → API → request a key (v3 `api_key`). The user does this themself; the key never goes into git.
2. **Postman collection `TMDB movie-app`** with a collection variable `apiKey`, and three requests that mirror the service methods:
   | Request | URL | Used by |
   |---|---|---|
   | Now playing | `GET https://api.themoviedb.org/3/movie/now_playing?api_key={{apiKey}}` | `getMovieList()` |
   | Movie by id | `GET https://api.themoviedb.org/3/movie/{{id}}?api_key={{apiKey}}` (e.g. id `926393`) | `getMovieById(id)` |
   | Search by title | `GET https://api.themoviedb.org/3/search/movie?query={{title}}&api_key={{apiKey}}` | `getMovieByTitle(title)` |
3. **Check each response:** status 200, `results[]` array for list/search, single object for by-id; note pagination fields (`page`, `total_pages`) and that `poster_path` is relative (prefix `https://image.tmdb.org/t/p/w500`).
4. **Build the interfaces from real JSON:** paste a by-id response and a list response into transform.tools (JSON → TypeScript) → `Movie` and `MovieListResponse` in `src/app/models/movie.ts`.
5. **Export the collection** (without the key value) to `postman/tmdb-movie-app.postman_collection.json` in the repo as proof of API testing.

## Requirements checklist (from the subject)
| # | Requirement | §  |
|---|---|---|
| R1 | App named `movie-app` | A-1 |
| R2 | Font Awesome: `@fortawesome/fontawesome-svg-core`, `free-solid-svg-icons`, `angular-fontawesome` | A-2/3 |
| R3 | `src/environments/environment.ts` holds the API key | A-4 |
| R4 | Components `head-bar`, `search-bar`, `movie-list`, `movie-detail`, `movie-search`, `wishlist` | A-5 |
| R5 | `movie` service: `getMovieList`, `getMovieById`, `getMovieByTitle` | A-6, B |
| R6 | `Movie` interface from TMDB JSON (transform.tools) | A-7 |
| R7 | `private httpClient = inject(HttpClient)`; `provideHttpClient(withFetch())` in `app.config.ts` | B |
| R8 | `app.routes.ts` + `provideRouter(routes)` | C |
| R9 | head-bar: h1 "Movie List" + "Wish list" button with heart icon, in root component | D |
| R10 | search-bar: `(input)` → `searchMovieByTitle(title)`, magnifier icon | E |
| R11 | movie-list hosts search-bar; child passes title to parent; `*ngIf; else` + `ng-template` | F |
| R12 | movie-detail: `getMovieById(id)`; poster, title, original title, language, release date, popularity, votes, overview, heart | G |

## Architecture
```
src/environments/environment.ts          apiKey, apiUrl, imageUrl (gitignored)
src/environments/environment.example.ts  committed template
src/app/models/movie.ts                  Movie, MovieListResponse
src/app/services/movie.service.ts        3 HTTP methods returning Observables
src/app/services/wishlist.service.ts     signal + localStorage
src/app/components/{head-bar,search-bar,movie-list,movie-search,movie-detail,wishlist}/
src/app/app.routes.ts, app.config.ts, app.ts/html (<app-head-bar/> + <router-outlet/>)
```
Routes: `''`→MovieList · `movie/:id`→MovieDetail · `search/:title`→MovieSearch · `wishlist`→Wishlist · `**`→redirect `''`.

Data flow: search-bar emits title via `output()` → movie-list shows results or default list (`ngIf/else`); poster click → `/movie/:id` → `ActivatedRoute` id → `getMovieById`; heart toggles `WishlistService`; posters from `https://image.tmdb.org/t/p/w500{poster_path}`.

## Milestones (branch → `--no-ff` merge into `main`)
| # | Branch | Work | Status |
|---|---|---|---|
| M0 | `main` | Repo, PLAN.md, .gitignore (exists) | ✅ done |
| M0.5 | `chore/api-postman` | Step 0: Postman collection export committed, sample responses noted | ✅ done |
| M1 | `feat/setup` | `ng new movie-app` (standalone, CSS), Font Awesome, environment files, generate components/service/interface | ✅ done |
| M2 | `feat/movie-service` | Movie interface from a real Postman response, 3 service methods, `provideHttpClient(withFetch())` | ✅ done |
| M3 | `feat/routing` | routes + `provideRouter` + `<router-outlet>` | ✅ done |
| M4 | `feat/head-bar` | Figure 2 | ✅ done |
| M5 | `feat/movie-list` | Figure 1 poster grid | ✅ done |
| M6 | `feat/search-bar` | live search, child→parent, `ngIf/else`, movie-search page | ✅ done |
| M7 | `feat/movie-detail` | Figure 4 | ✅ done |
| M8 | `feat/wishlist` | wishlist service + page, heart toggle | ✅ done |
| M9 | `chore/polish` | loading/error states, responsive, README, `ng build`, tag `v1.0.0` | ✅ done |
| M10 | `chore/deploy` | GitHub repo + `ng build --base-href /movie-app/` published to `gh-pages` (needs user OK before pushing) | ⏳ next |

Commits: conventional (`feat(service): add getMovieById`), small and per step.

## Subject issues to handle
- Header "Angular 22" vs notes "Angular 18" → use current CLI; `inject`/`withFetch`/`provideRouter` still valid.
- `ngIf` is legacy (modern `@if`) → follow the subject, import `NgIf`.
- `getMovieById` URL missing `=` after `api_key`.
- Figure 4 shows "Release date" twice; second value is **popularity**.
- `wishlist`/`movie-search` required but undescribed → designed above.
- API key: gitignored `environment.ts`; still visible in the browser bundle (front-end limitation).

## Comparison with the friend's project (`D:\Downloads-d\movie-app.zip`, read in place, not extracted)
Angular 22.2, standalone components, signals, `@for`/`@if`, Font Awesome, Vitest. Git: **1 commit only** ("initial commit").

| Subject req. | Friend | Our plan |
|---|---|---|
| R3 API key in environment | Key **hard-coded and committed** in `environments.ts` + `environment.development.ts`; file misnamed (`environments.ts`); service imports the dev file directly | gitignored `environment.ts` + committed `environment.example.ts` |
| R5 `getMovieByTitle` | **Missing.** Search filters the now-playing page client-side | Calls `/search/movie?query=` |
| R7 `withFetch()` | Missing (`provideHttpClient()` only) | Included |
| R9 h1 "Movie List" | "My Movie-DB" | "Movie List" as in Figure 2 |
| R10/R11 search inside movie-list, child→parent | search-bar in root `app.html`, talks to the service directly; no `output()` | search-bar inside movie-list, `output()` to parent |
| R11 `ngIf; else` + `ng-template` | Not used (`@for` only) | Used as required |
| R12 detail | No title heading, no popularity, no "Overview" label, buttons instead of heart icon | All fields + heart (Figure 4) |
| `movie-search` | Generated stub, unused | Real `/search/:title` page |
| Routing | `':id'` catches any path | `movie/:id` (no clash) |
| Postman | Nothing in repo | Collection exported |
| Posters | `/t/p/original/` (heavy) | `/t/p/w500` |

**Worth reusing from the friend:** signals in the service for state (`movieList`, `wishList`); wishlist with localStorage and safe parsing; `paramMap` + `switchMap` in movie-detail; "Back to movie list" button; wishlist empty state; `@for … track movie.id`.

**Plan changes from this comparison:**
- Keep the wishlist logic inside a dedicated `WishlistService` (same localStorage approach as the friend, separated from HTTP).
- movie-detail: use `paramMap.pipe(switchMap(...))` (observables topic) + keep a back button.
- Keep `ngIf/else/ng-template` where the subject asks, `@for` elsewhere is fine.
- Add a README section that lists R1–R12 with where each is implemented, so the teacher sees full coverage (friend's README is the CLI default).
- Many small commits per milestone; the friend's single commit shows no progress history.

## Three-way comparison: our plan → friend → teacher
Teacher: github.com/ilhem-baroud/movie-app-2027. `main` is only the empty `ng new` starter (4 "Auto-generated commit"s); the real app exists only as the compiled build on `gh-pages` (live demo). Analysed from that bundle.

**Finding: the friend's project is essentially the teacher's solution** — same env names (`url_api`, `url_movie_api`), same routes (`''`, `wishlist`, `:id`, `**`), same texts ("My Movie-DB", "e.g : Dexter", "Back to movie list"), same client-side search.

| Point | Our plan | Friend | Teacher |
|---|---|---|---|
| Components | 6 incl. real `movie-search` | 6, `movie-search` stub | 5, no `movie-search` |
| Routes | `''`, `movie/:id`, `search/:title`, `wishlist` | `''`, `wishlist`, `:id` | same as friend |
| Search | API `/search/movie` (`getMovieByTitle`) | filter now-playing client-side | same, + `shareReplay` cache on `getMovieList` |
| Search-bar placement | inside movie-list, `output()` to parent | root `app.html`, via service | same as friend |
| `ngIf/else/ng-template` | yes | no (`@if/@for`) | no |
| State | services + signals | signals in `MovieService` | same |
| Wishlist | own service, add/remove, localStorage | add/remove/toggle, reloads from localStorage, validated | add only; saves to localStorage but starts empty on reload |
| Detail | all Figure 4 fields + heart | no title/popularity/overview label | similar to friend, "Add to Wishlist" button |
| `withFetch()` | yes | no | no |
| API key | gitignored + example file | committed in git | in public bundle (any front-end deploy) |
| Postman | collection exported | none | none visible |
| Git history | branch per milestone | 1 commit | 4 auto commits, source not pushed |
| Deploy | not planned | no | GitHub Pages (`base href=/movie-app-2027/`) |

**What changes in our plan:**
- Add **M10 deploy to GitHub Pages** (`ng build --base-href /movie-app/` + `gh-pages` branch), like the teacher.
- Add `shareReplay(1)` on `getMovieList()` (teacher's observables touch).
- Keep the friend's wishlist robustness (remove + reload from storage) — better than the teacher's.
- **Decision (user):** follow the PDF for every requirement (API search, `ngIf/else`, child→parent `output()`, "Movie List", movie-search page) **and** keep the extras: `shareReplay`, GitHub Pages deploy, friend's wishlist.

## Verification
- `git log --oneline` shows the plan commit; `PLAN.md` covers R1–R12.
- Per milestone later: `ng serve` and compare screens with Figures 1, 2, 4; final `ng build` passes with no errors.
