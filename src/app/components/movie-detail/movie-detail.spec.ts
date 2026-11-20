import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { MovieDetails } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { MovieDetail } from './movie-detail';

const equalizer = {
  id: 926393,
  title: 'The Equalizer 3',
  original_title: 'The Equalizer 3',
  original_language: 'en',
  release_date: '2023-08-30',
  popularity: 2471.515,
  vote_average: 7.3,
  vote_count: 1027,
  overview: 'Robert McCall finds himself at home in Southern Italy.',
  poster_path: '/eq3.jpg',
} as MovieDetails;

async function open(url: string, getMovieById: (id: number) => Observable<MovieDetails>) {
  const requestedIds: number[] = [];
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{ path: 'movie/:id', component: MovieDetail }]),
      {
        provide: MovieService,
        useValue: {
          getMovieById: (id: number) => {
            requestedIds.push(id);
            return getMovieById(id);
          },
          getPosterUrl: (path: string | null) => `img${path}`,
        },
      },
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url, MovieDetail);
  return { harness, element: harness.routeNativeElement as HTMLElement, requestedIds };
}

function field(element: HTMLElement, label: string): string | undefined {
  const dt = [...element.querySelectorAll('dt')].find((e) => e.textContent?.trim() === label);
  return dt?.nextElementSibling?.textContent?.trim();
}

describe('MovieDetail', () => {
  beforeEach(() => localStorage.clear());

  it('loads the movie whose id is in the URL', async () => {
    const { requestedIds } = await open('/movie/926393', () => of(equalizer));
    expect(requestedIds).toEqual([926393]);
  });

  it('shows every field of Figure 4', async () => {
    const { element } = await open('/movie/926393', () => of(equalizer));

    expect(element.querySelector('h2')?.textContent).toBe('The Equalizer 3');
    expect(element.querySelector('.poster img')?.getAttribute('src')).toBe('img/eq3.jpg');
    expect(field(element, 'Original title')).toBe('The Equalizer 3');
    expect(field(element, 'Original language')).toBe('en');
    expect(field(element, 'Release date')).toBe('Aug 30, 2023');
    expect(field(element, 'Popularity')).toBe('2,471.515');
    expect(field(element, 'Vote average')).toBe('7.3');
    expect(field(element, 'Vote count')).toBe('1027');
    expect(element.querySelector('.overview')?.textContent).toContain('Southern Italy');
  });

  it('shows an error message when the movie cannot be loaded', async () => {
    const { element } = await open('/movie/1', () => throwError(() => new Error('404')));
    expect(element.textContent).toContain('This movie could not be loaded.');
  });

  it('the heart adds the movie to the wish list and turns active, then removes it', async () => {
    const { harness, element } = await open('/movie/926393', () => of(equalizer));
    const wishlist = TestBed.inject(WishlistService);
    const heart = element.querySelector('.heart-button') as HTMLButtonElement;

    expect(heart.classList).not.toContain('active');
    heart.click();
    await harness.fixture.whenStable();
    expect(wishlist.has(926393)).toBe(true);
    expect(heart.classList).toContain('active');
    expect(heart.getAttribute('aria-pressed')).toBe('true');

    heart.click();
    await harness.fixture.whenStable();
    expect(wishlist.has(926393)).toBe(false);
    expect(heart.classList).not.toContain('active');
  });
});
