import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HeadBar } from './head-bar';

describe('HeadBar', () => {
  let fixture: ComponentFixture<HeadBar>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadBar],
      providers: [provideRouter([{ path: 'wishlist', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadBar);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('shows the "Movie List" title in an h1', () => {
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Movie List');
  });

  it('has a "Wish list" button with a heart icon that links to /wishlist', () => {
    const button = element.querySelector('button.wishlist-button');
    expect(button?.textContent?.trim()).toBe('Wish list');
    expect(button?.querySelector('fa-icon svg[data-icon="heart"]')).toBeTruthy();
  });

  it('clicking "Wish list" navigates to /wishlist', async () => {
    (element.querySelector('button.wishlist-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/wishlist');
  });
});
