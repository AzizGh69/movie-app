import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

/** Full search results page: /search/:title (opened with Enter in the search bar). */
@Component({
  imports: [AsyncPipe, RouterLink],
  selector: 'app-movie-search',
  styleUrls: ['../movie-list/movie-list.css', './movie-search.css'],
  templateUrl: './movie-search.html',
})
export class MovieSearch {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  title$: Observable<string> = this.route.paramMap.pipe(map((params) => params.get('title') ?? ''));

  movies$: Observable<Movie[]> = this.title$.pipe(
    switchMap((title) =>
      this.movieService.getMovieByTitle(title).pipe(catchError(() => of([] as Movie[]))),
    ),
  );

  posterUrl(movie: Movie): string {
    return this.movieService.getPosterUrl(movie.poster_path);
  }
}
