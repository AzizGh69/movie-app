import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { MovieList } from './movie-list';

const movies = [
  { id: 1, title: 'Expend4bles', poster_path: '/a.jpg' },
  { id: 2, title: 'The Equalizer 3', poster_path: null },
] as Movie[];

async function render(list$: Observable<Movie[]>): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [MovieList],
    providers: [
      provideRouter([]),
      {
        provide: MovieService,
        useValue: {
          getMovieList: () => list$,
          getPosterUrl: (path: string | null) => (path ? `img${path}` : ''),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(MovieList);
  await fixture.whenStable();
  return fixture.nativeElement;
}

describe('MovieList', () => {
  it('shows one card per movie with its title and a link to its detail page', async () => {
    const element = await render(of(movies));
    const cards = element.querySelectorAll<HTMLAnchorElement>('a.movie-card');

    expect(cards.length).toBe(2);
    expect(cards[0].querySelector('.movie-title')?.textContent?.trim()).toBe('Expend4bles');
    expect(cards[0].getAttribute('href')).toBe('/movie/1');
    expect(cards[0].querySelector('img')?.getAttribute('src')).toBe('img/a.jpg');
  });

  it('shows a placeholder when a movie has no poster', async () => {
    const element = await render(of(movies));
    expect(element.querySelectorAll('a.movie-card')[1].querySelector('.no-poster')).toBeTruthy();
  });

  it('shows an error message when the API call fails', async () => {
    const element = await render(throwError(() => new Error('401')));
    expect(element.querySelector('.message')?.textContent).toContain('Could not load the movies');
    expect(element.querySelector('.movie-grid')).toBeNull();
  });
});
