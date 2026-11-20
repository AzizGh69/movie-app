import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { MovieSearch } from './movie-search';

describe('MovieSearch', () => {
  it('searches the title from the URL and shows the results', async () => {
    const searches: string[] = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'search/:title', component: MovieSearch }]),
        {
          provide: MovieService,
          useValue: {
            getMovieByTitle: (title: string) => {
              searches.push(title);
              return of([{ id: 3, title: 'The Equalizer', poster_path: null }] as Movie[]);
            },
            getPosterUrl: () => '',
          },
        },
      ],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/search/equalizer', MovieSearch);
    const element = harness.routeNativeElement as HTMLElement;

    expect(searches).toEqual(['equalizer']);
    expect(element.querySelector('.results-title')?.textContent).toContain('equalizer');
    expect(element.querySelector('.movie-title')?.textContent?.trim()).toBe('The Equalizer');
  });
});
