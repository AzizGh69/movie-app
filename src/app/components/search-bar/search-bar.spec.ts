import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let fixture: ComponentFixture<SearchBar>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [provideRouter([{ path: 'search/:title', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchBar);
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
  });

  it('shows a search box with the "movie title" placeholder and a magnifier icon', () => {
    expect(input.placeholder).toBe('movie title');
    expect(fixture.nativeElement.querySelector('fa-icon svg[data-icon="magnifying-glass"]')).toBeTruthy();
  });

  it('emits the typed title to the parent on each input event', () => {
    const emitted: string[] = [];
    fixture.componentInstance.titleChange.subscribe((title) => emitted.push(title));

    input.value = 'equ';
    input.dispatchEvent(new Event('input'));
    input.value = 'equalizer';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['equ', 'equalizer']);
  });

  it('Enter opens the /search/:title page', async () => {
    input.value = 'equalizer';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/search/equalizer');
  });
});
