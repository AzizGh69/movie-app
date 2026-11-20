import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { MovieDetails } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  imports: [AsyncPipe, DatePipe, DecimalPipe, RouterLink],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  loadError = signal(false);

  /** Reads :id from the URL, then loads that movie (switchMap cancels the old request). */
  movie$: Observable<MovieDetails | null> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    tap(() => this.loadError.set(false)),
    switchMap((id) =>
      this.movieService.getMovieById(id).pipe(
        catchError(() => {
          this.loadError.set(true);
          return of(null);
        }),
      ),
    ),
  );

  posterUrl(movie: MovieDetails): string {
    return this.movieService.getPosterUrl(movie.poster_path);
  }
}
