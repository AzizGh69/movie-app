import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';

const KEY = 'movie-app.wishlist';
const equalizer = { id: 1, title: 'The Equalizer 3', poster_path: '/eq.jpg' };
const nun = { id: 2, title: 'The Nun II', poster_path: null };

function create(): WishlistService {
  TestBed.resetTestingModule();
  return TestBed.inject(WishlistService);
}

describe('WishlistService', () => {
  beforeEach(() => localStorage.clear());

  it('starts empty', () => {
    const service = create();
    expect(service.movies()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('adds movies (newest first) without duplicates', () => {
    const service = create();
    service.add(equalizer);
    service.add(nun);
    service.add(equalizer);

    expect(service.movies().map((m) => m.id)).toEqual([2, 1]);
    expect(service.count()).toBe(2);
    expect(service.has(1)).toBe(true);
  });

  it('keeps only id, title and poster_path', () => {
    const service = create();
    service.add({ ...equalizer, overview: 'long text' } as typeof equalizer);
    expect(service.movies()[0]).toEqual(equalizer);
  });

  it('removes and toggles movies', () => {
    const service = create();
    service.toggle(equalizer);
    expect(service.has(1)).toBe(true);
    service.toggle(equalizer);
    expect(service.has(1)).toBe(false);

    service.add(nun);
    service.remove(2);
    expect(service.count()).toBe(0);
  });

  it('survives a page reload (localStorage)', () => {
    create().add(equalizer);
    expect(create().movies()).toEqual([equalizer]);
  });

  it('ignores broken or invalid saved data', () => {
    localStorage.setItem(KEY, '{not json');
    expect(create().movies()).toEqual([]);

    localStorage.setItem(KEY, JSON.stringify([equalizer, { id: 'x' }, null, 42]));
    expect(create().movies()).toEqual([equalizer]);
  });
});
