import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  imports: [AsyncPipe, NgIf, NgTemplateOutlet, RouterLink, SearchBar],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList {
  private movieService = inject(MovieService);

  loadError = signal(false);

  /** Title typed in the child search-bar ('' = show the now-playing list). */
  searchTitle = signal('');

  /** Now-playing movies; on error, show a message instead of the grid. */
  movies$: Observable<Movie[]> = this.movieService.getMovieList().pipe(
    catchError(() => {
      this.loadError.set(true);
      return of([]);
    }),
  );

  /**
   * Search results: wait 300 ms after the last key, skip repeated titles,
   * and cancel the previous request when a new title arrives (switchMap).
   */
  searchResults$: Observable<Movie[]> = toObservable(this.searchTitle).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((title) =>
      this.movieService.getMovieByTitle(title).pipe(catchError(() => of([] as Movie[]))),
    ),
  );

  /** Receives the title emitted by the child search-bar. */
  onTitleChange(title: string): void {
    this.searchTitle.set(title.trim());
  }

  posterUrl(movie: Movie): string {
    return this.movieService.getPosterUrl(movie.poster_path);
  }
}
