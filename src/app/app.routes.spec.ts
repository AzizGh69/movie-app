import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { MovieList } from './components/movie-list/movie-list';
import { MovieSearch } from './components/movie-search/movie-search';
import { Wishlist } from './components/wishlist/wishlist';

describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    harness = await RouterTestingHarness.create();
  });

  it('"/" shows the movie list', async () => {
    expect(await harness.navigateByUrl('/')).toBeInstanceOf(MovieList);
  });

  it('"/movie/:id" shows the movie detail', async () => {
    expect(await harness.navigateByUrl('/movie/926393')).toBeInstanceOf(MovieDetail);
  });

  it('"/search/:title" shows the search results', async () => {
    expect(await harness.navigateByUrl('/search/equalizer')).toBeInstanceOf(MovieSearch);
  });

  it('"/wishlist" shows the wish list', async () => {
    expect(await harness.navigateByUrl('/wishlist')).toBeInstanceOf(Wishlist);
  });

  it('an unknown URL redirects to the movie list', async () => {
    expect(await harness.navigateByUrl('/does-not-exist')).toBeInstanceOf(MovieList);
  });
});
