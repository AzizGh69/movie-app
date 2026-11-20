import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieDetail, MovieListResponse } from '../models/movie';

@Service()
export class MovieService {
  private httpClient = inject(HttpClient);
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;

  /** Now-playing list, fetched once and shared by every subscriber (shareReplay). */
  private movieList$ = this.httpClient
    .get<MovieListResponse>(`${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}`)
    .pipe(
      map((response) => response.results),
      shareReplay(1),
    );

  /** Movies now playing in cinemas. */
  getMovieList(): Observable<Movie[]> {
    return this.movieList$;
  }

  /** One movie by its TMDB id. */
  getMovieById(id: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  /** Movies whose title matches the search text. Empty text → empty list, no request. */
  getMovieByTitle(title: string): Observable<Movie[]> {
    const query = title.trim();
    if (!query) {
      return of([]);
    }
    return this.httpClient
      .get<MovieListResponse>(
        `${this.apiUrl}/search/movie?query=${encodeURIComponent(query)}&api_key=${this.apiKey}`,
      )
      .pipe(map((response) => response.results));
  }

  /** Full poster URL, or '' when TMDB has no poster. */
  getPosterUrl(posterPath: string | null): string {
    return posterPath ? `${environment.imageUrl}${posterPath}` : '';
  }
}
