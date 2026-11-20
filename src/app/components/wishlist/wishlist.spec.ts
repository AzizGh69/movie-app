import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { Wishlist } from './wishlist';

describe('Wishlist page', () => {
  let fixture: ComponentFixture<Wishlist>;
  let element: HTMLElement;
  let wishlist: WishlistService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Wishlist],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: { getPosterUrl: (p: string | null) => `img${p}` } },
      ],
    });
    wishlist = TestBed.inject(WishlistService);
    fixture = TestBed.createComponent(Wishlist);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows a message when the list is empty', () => {
    expect(element.querySelector('.message')?.textContent).toContain('Your wish list is empty');
  });

  it('shows saved movies and removes one with its button', async () => {
    wishlist.add({ id: 1, title: 'The Equalizer 3', poster_path: '/eq.jpg' });
    wishlist.add({ id: 2, title: 'The Nun II', poster_path: null });
    await fixture.whenStable();

    const titles = () => [...element.querySelectorAll('.movie-title')].map((e) => e.textContent?.trim());
    expect(titles()).toEqual(['The Nun II', 'The Equalizer 3']);
    expect(element.querySelector('h2')?.textContent).toContain('(2)');

    (element.querySelector('.remove-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(titles()).toEqual(['The Equalizer 3']);
  });
});
