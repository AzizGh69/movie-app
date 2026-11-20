import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Movie, MovieListResponse } from '../models/movie';
import { MovieService } from './movie.service';

const { apiUrl, apiKey, imageUrl } = environment;

const movie = { id: 926393, title: 'The Equalizer 3', poster_path: '/poster.jpg' } as Movie;
const listResponse = { page: 1, results: [movie], total_pages: 1, total_results: 1 } as MovieListResponse;

describe('MovieService', () => {
  let service: MovieService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getMovieList calls now_playing and returns the results array', () => {
    let result: Movie[] = [];
    service.getMovieList().subscribe((movies) => (result = movies));

    http.expectOne(`${apiUrl}/movie/now_playing?api_key=${apiKey}`).flush(listResponse);
    expect(result).toEqual([movie]);
  });

  it('getMovieList is cached: a second subscriber sends no new request', () => {
    service.getMovieList().subscribe();
    http.expectOne(`${apiUrl}/movie/now_playing?api_key=${apiKey}`).flush(listResponse);

    let second: Movie[] = [];
    service.getMovieList().subscribe((movies) => (second = movies));
    http.expectNone(`${apiUrl}/movie/now_playing?api_key=${apiKey}`);
    expect(second).toEqual([movie]);
  });

  it('getMovieById calls /movie/{id}', () => {
    let title = '';
    service.getMovieById(926393).subscribe((m) => (title = m.title));

    http.expectOne(`${apiUrl}/movie/926393?api_key=${apiKey}`).flush(movie);
    expect(title).toBe('The Equalizer 3');
  });

  it('getMovieByTitle calls /search/movie with an encoded query', () => {
    let result: Movie[] = [];
    service.getMovieByTitle('  mission: impossible ').subscribe((movies) => (result = movies));

    http
      .expectOne(`${apiUrl}/search/movie?query=mission%3A%20impossible&api_key=${apiKey}`)
      .flush(listResponse);
    expect(result).toEqual([movie]);
  });

  it('getMovieByTitle with empty text returns [] without a request', () => {
    let result: Movie[] | undefined;
    service.getMovieByTitle('   ').subscribe((movies) => (result = movies));
    expect(result).toEqual([]);
  });

  it('getPosterUrl builds the image URL, or "" when missing', () => {
    expect(service.getPosterUrl('/poster.jpg')).toBe(`${imageUrl}/poster.jpg`);
    expect(service.getPosterUrl(null)).toBe('');
  });
});
