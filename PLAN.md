# movie-app — Delivery Plan (TP-3, Angular 22)

Goal: an Angular app that lists TMDB "now playing" movies, searches by title, shows a movie's details, and has a wish list. Topics graded: **APIs, HTTP requests, routing, observables**.

---

## 1. Requirements checklist (from the subject)

| # | Requirement | Section |
|---|---|---|
| R1 | App named `movie-app` | A-1 |
| R2 | Font Awesome installed (`fontawesome-svg-core`, `free-solid-svg-icons`, `angular-fontawesome`) | A-2/3 |
| R3 | `src/environments/environment.ts` holds the TMDB API key | A-4 |
| R4 | Components: `head-bar`, `search-bar`, `movie-list`, `movie-detail`, `movie-search`, `wishlist` | A-5 |
| R5 | `movie` service with `getMovieList`, `getMovieById`, `getMovieByTitle` | A-6, B |
| R6 | `Movie` interface matching TMDB's JSON | A-7 |
| R7 | `HttpClient` via `inject()`, `provideHttpClient(withFetch())` in `app.config.ts` | B |
| R8 | Routes in `app.routes.ts`, `provideRouter(routes)` in `app.config.ts` | C |
| R9 | head-bar: h1 "Movie List" + "Wish list" button with heart icon, yellow bar, inserted in root component | D |
| R10 | search-bar: `(input)` event → `searchMovieByTitle(title)`, magnifier icon, styled | E |
| R11 | movie-list: hosts search-bar, shows TMDB list **or** search results; child → parent via `@Output`/`output()`; uses `*ngIf; else` + `ng-template` | F |
| R12 | movie-detail: calls `getMovieById(id)`; shows poster, title, original title, language, release date, popularity, vote average, vote count, overview, heart | G |

---

## 2. Architecture

```
src/
  environments/environment.ts        apiKey, apiUrl, imageUrl   (gitignored, see §5)
  environments/environment.example.ts  template committed to git
  app/
    models/movie.ts                   Movie + MovieListResponse interfaces
    services/movie.service.ts         HTTP calls (Observables)
    services/wishlist.service.ts      wish list state (signal + localStorage)
    components/
      head-bar/       title + Wish list button (routerLink="/wishlist")
      search-bar/     input → output() event with the title
      movie-list/     grid of posters; hosts <app-search-bar>
      movie-search/   (optional page) results for /search/:title
      movie-detail/   details page for /movie/:id
      wishlist/       list of saved movies
    app.routes.ts
    app.config.ts     provideRouter(routes), provideHttpClient(withFetch())
    app.ts/html       <app-head-bar /> + <router-outlet />
```

**Routes**

| Path | Component |
|---|---|
| `''` | `MovieList` |
| `movie/:id` | `MovieDetail` |
| `search/:title` | `MovieSearch` |
| `wishlist` | `Wishlist` |
| `**` | redirect to `''` |

**Data flow**
- `MovieService` returns `Observable<…>`; `getMovieList()`/`getMovieByTitle()` `map(res => res.results)`.
- `search-bar` emits the title → `movie-list` stores it; empty → show now-playing list, otherwise show search results (`*ngIf="searchResults; else defaultList"` + `<ng-template #defaultList>`).
- Clicking a poster → `routerLink="/movie/{{id}}"` → `movie-detail` reads `id` from `ActivatedRoute` and calls `getMovieById`.
- Heart on the detail page adds/removes from `WishlistService`; `wishlist` page displays it.
- Posters: `https://image.tmdb.org/t/p/w500{{poster_path}}`.

---

## 3. Milestones (each = one feature branch → merged into `main`)

| # | Branch | Work | Done when |
|---|---|---|---|
| M0 | `main` | Repo, `PLAN.md`, `.gitignore`, README | ✅ this commit |
| M1 | `feat/setup` | `ng new movie-app` (standalone, CSS, routing), install Font Awesome, environments files, generate all 6 components + service + interface | `ng serve` runs, folders in place |
| M2 | `feat/movie-service` | `Movie` interface (from a real TMDB response via Postman → transform.tools), `MovieService` 3 methods, `provideHttpClient(withFetch())` | Test call logs movies in console |
| M3 | `feat/routing` | `app.routes.ts`, `provideRouter`, root template with `<router-outlet>` | URLs open the right components |
| M4 | `feat/head-bar` | Title, heart button, yellow styles, inserted in root | Matches Figure 2 |
| M5 | `feat/movie-list` | Poster grid (4 cols, black bg, yellow title captions) | Matches Figure 1 |
| M6 | `feat/search-bar` | `(input)` → `searchMovieByTitle`, `output()` to parent, `ngIf/else/ng-template`, `movie-search` page | Typing filters results live |
| M7 | `feat/movie-detail` | Route param → `getMovieById`, layout + date pipe | Matches Figure 4 |
| M8 | `feat/wishlist` | Wishlist service + page, heart toggle | Add/remove persists on reload |
| M9 | `chore/polish` | Loading/empty/error states, responsive grid, README with screenshots, `ng build` clean | Tag `v1.0.0` |

---

## 4. Git conventions
- `main` always runs. One branch per milestone, merge with `--no-ff` so each section is visible in history.
- Conventional commits: `feat:`, `fix:`, `style:`, `chore:`, `docs:`.
- Small commits per step (e.g. `feat(service): add getMovieById`) — useful for the teacher to follow.
- Tag `v1.0.0` at delivery.

## 5. API key safety
- `environment.ts` is in `.gitignore`; `environment.example.ts` (with `apiKey: 'YOUR_TMDB_KEY'`) is committed. README says: copy it to `environment.ts` and paste your key.
- Note: a front-end key is always visible in the browser bundle; this only keeps it out of the git history.

## 6. Points to watch in the subject
- Header says **Angular 22** but the notes mention Angular 18 → we use the current CLI; the `inject()` / `provideHttpClient(withFetch())` / `provideRouter` approach is still valid.
- The subject asks for `*ngIf; else` + `ng-template`. Modern Angular prefers `@if/@else`; we follow the subject (import `NgIf`) and can mention `@if` as an alternative.
- `getMovieById` URL in the subject is missing `=` (`?api_key${…}`) → we use `?api_key=${…}`.
- Figure 4 shows "Release date" twice; the second value (2471.515) is actually **popularity** → we label it "Popularity".
- `wishlist` and `movie-search` are required components but not described → designed above (§2).

## 7. Before coding
Compare this plan with the friend's finished project: structure, routes, how search is passed parent↔child, wishlist approach, styling fidelity to the figures. Adjust milestones, then start M1.
