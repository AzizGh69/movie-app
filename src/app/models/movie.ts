// Interfaces generated from real TMDB responses (Postman → transform.tools JSON-to-TypeScript).

/** A movie as returned in lists: /movie/now_playing and /search/movie */
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/** Paginated list response: /movie/now_playing and /search/movie */
export interface MovieListResponse {
  dates?: { maximum: string; minimum: string }; // only on now_playing
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

/** A single movie: /movie/{id} (genres instead of genre_ids, plus extra fields) */
export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
}
