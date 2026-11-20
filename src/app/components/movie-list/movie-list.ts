import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  imports: [AsyncPipe, RouterLink],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList {
  private movieService = inject(MovieService);

  loadError = signal(false);

  /** Now-playing movies; on error, show a message instead of the grid. */
  movies$: Observable<Movie[]> = this.movieService.getMovieList().pipe(
    catchError(() => {
      this.loadError.set(true);
      return of([]);
    }),
  );

  posterUrl(movie: Movie): string {
    return this.movieService.getPosterUrl(movie.poster_path);
  }
}
