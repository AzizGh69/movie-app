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
const searchResults = [{ id: 3, title: 'The Equalizer', poster_path: '/e.jpg' }] as Movie[];

async function render(list$: Observable<Movie[]>) {
  const searches: string[] = [];
  TestBed.configureTestingModule({
    imports: [MovieList],
    providers: [
      provideRouter([]),
      {
        provide: MovieService,
        useValue: {
          getMovieList: () => list$,
          getMovieByTitle: (title: string) => {
            searches.push(title);
            return of(searchResults);
          },
          getPosterUrl: (path: string | null) => (path ? `img${path}` : ''),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(MovieList);
  await fixture.whenStable();
  return { fixture, element: fixture.nativeElement as HTMLElement, searches };
}

function titles(element: HTMLElement): string[] {
  return [...element.querySelectorAll('.movie-title')].map((e) => e.textContent!.trim());
}

describe('MovieList', () => {
  it('hosts the search-bar', async () => {
    const { element } = await render(of(movies));
    expect(element.querySelector('app-search-bar input')).toBeTruthy();
  });

  it('shows one card per movie with its title and a link to its detail page', async () => {
    const { element } = await render(of(movies));
    const cards = element.querySelectorAll<HTMLAnchorElement>('a.movie-card');

    expect(cards.length).toBe(2);
    expect(titles(element)).toEqual(['Expend4bles', 'The Equalizer 3']);
    expect(cards[0].getAttribute('href')).toBe('/movie/1');
    expect(cards[0].querySelector('img')?.getAttribute('src')).toBe('img/a.jpg');
  });

  it('shows a placeholder when a movie has no poster', async () => {
    const { element } = await render(of(movies));
    expect(element.querySelectorAll('a.movie-card')[1].querySelector('.no-poster')).toBeTruthy();
  });

  it('shows an error message when the API call fails', async () => {
    const { element } = await render(throwError(() => new Error('401')));
    expect(element.querySelector('.message')?.textContent).toContain('Could not load the movies');
    expect(element.querySelector('.movie-grid')).toBeNull();
  });

  it('switches to search results when the search-bar emits a title, and back when cleared', async () => {
    const { fixture, element, searches } = await render(of(movies));

    fixture.componentInstance.onTitleChange('  equalizer ');
    await new Promise((resolve) => setTimeout(resolve, 350)); // debounceTime(300)
    await fixture.whenStable();

    expect(searches).toEqual(['equalizer']);
    expect(element.querySelector('.results-title')?.textContent).toContain('equalizer');
    expect(titles(element)).toEqual(['The Equalizer']);

    fixture.componentInstance.onTitleChange('');
    await fixture.whenStable();
    expect(titles(element)).toEqual(['Expend4bles', 'The Equalizer 3']);
  });
});
