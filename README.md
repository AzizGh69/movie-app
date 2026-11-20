# movie-app — TP-3 Angular 22

Angular app that lists movies from [TMDB](https://www.themoviedb.org/): now-playing movies, live search by title, movie details and a wish list.

Topics covered: **APIs, HTTP requests, routing, observables**.

Live demo: https://azizgh69.github.io/movie-app/

## Features

- **Movie list**: now-playing movies as a poster grid (4 columns on desktop, 2 on phones).
- **Live search**: type a title, and results appear after a short pause (one API call, not one per letter). Press **Enter** to open the full results page.
- **Movie details**: poster, title, original title, language, release date, popularity, vote average, vote count and overview.
- **Wish list**: the heart on a movie's page adds or removes it. The list is saved in the browser (`localStorage`), so it survives a reload.

## Getting started

Requirements: Node.js 22.22.3+ (or 24.15+ / 26+) and a TMDB v3 API key ([get one here](https://www.themoviedb.org/settings/api)).

```bash
npm install

# Create the two environment files from the template, then paste your key in both
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts

npm start          # http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build in dist/movie-app
```

`environment.ts` and `environment.development.ts` are git-ignored, so the API key is never committed. (Any key used by a front-end app is still visible in the browser.)

## Requirement map (subject TP-3)

| # | Subject requirement | Where |
|---|---|---|
| A-1 | Angular app `movie-app` | Angular CLI 22, standalone components |
| A-2/3 | Font Awesome icons | `@fortawesome/*` packages; `faHeart`, `faMagnifyingGlass`, `faTrash` |
| A-4 | API key in `environments/environment.ts` | [src/environments/](src/environments/) (template: `environment.example.ts`) |
| A-5 | Components head-bar, search-bar, movie-list, movie-detail, movie-search, wishlist | [src/app/components/](src/app/components/) |
| A-6, B | `movie` service with `getMovieList`, `getMovieById`, `getMovieByTitle` | [movie.service.ts](src/app/services/movie.service.ts) |
| A-7 | `Movie` interface from TMDB's JSON | [models/movie.ts](src/app/models/movie.ts) |
| B | `inject(HttpClient)` and `provideHttpClient(withFetch())` | [movie.service.ts](src/app/services/movie.service.ts), [app.config.ts](src/app/app.config.ts) |
| C | Routes in `app.routes.ts`, `provideRouter(routes)` | [app.routes.ts](src/app/app.routes.ts), [app.config.ts](src/app/app.config.ts) |
| D | head-bar: h1 "Movie List" + "Wish list" button with heart, in the root component | [head-bar/](src/app/components/head-bar/), [app.html](src/app/app.html) |
| E | search-bar: `(input)` event → `searchMovieByTitle(title)` | [search-bar/](src/app/components/search-bar/) |
| F | movie-list hosts search-bar; child passes the title to the parent; `*ngIf; else` + `ng-template` | [movie-list/](src/app/components/movie-list/) (`output()` → `titleChange`) |
| G | movie-detail calls `getMovieById(id)` | [movie-detail/](src/app/components/movie-detail/) |

## Routes

| URL | Component |
|---|---|
| `/` | `MovieList` (with the search bar) |
| `/movie/:id` | `MovieDetail` |
| `/search/:title` | `MovieSearch` |
| `/wishlist` | `Wishlist` |
| anything else | redirects to `/` |

## Observables used

- `getMovieList()`: `map` to the `results` array, then `shareReplay(1)` so TMDB is called once.
- Live search: `toObservable(searchTitle)` → `debounceTime(300)` → `distinctUntilChanged()` → `switchMap(getMovieByTitle)` (the previous request is cancelled).
- Detail page: `paramMap` → `map` to the id → `switchMap(getMovieById)`.
- Errors: `catchError` shows a message instead of breaking the page.
- Templates read them with the `async` pipe.

## API testing (Postman)

[postman/tmdb-movie-app.postman_collection.json](postman/tmdb-movie-app.postman_collection.json) contains the 3 TMDB requests used by the service, each with tests (status 200, response shape). Import it into Postman and set the `apiKey` collection variable.

## Project structure

```
src/
  environments/            API key (git-ignored) + example template
  app/
    models/movie.ts        Movie, MovieListResponse, MovieDetails
    services/              MovieService (HTTP), WishlistService (localStorage)
    components/            head-bar, search-bar, movie-list, movie-search, movie-detail, wishlist
    app.routes.ts          routes
    app.config.ts          router + HttpClient providers
postman/                   Postman collection
PLAN.md                    delivery plan and milestones
```

## Git workflow

One branch per milestone (`feat/setup`, `feat/movie-service`, `feat/routing`, `feat/head-bar`, `feat/movie-list`, `feat/search-bar`, `feat/movie-detail`, `feat/wishlist`, …), merged into `main` with `--no-ff` so each step stays visible in the history (`git log --graph`).
