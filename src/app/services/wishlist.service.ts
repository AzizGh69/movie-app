import { computed, Service, signal } from '@angular/core';
import { Movie } from '../models/movie';

/** What we keep for each saved movie (enough to show its card). */
export type WishlistItem = Pick<Movie, 'id' | 'title' | 'poster_path'>;

const STORAGE_KEY = 'movie-app.wishlist';

@Service()
export class WishlistService {
  private items = signal<WishlistItem[]>(this.load());

  /** Saved movies, newest first (read-only for components). */
  readonly movies = this.items.asReadonly();
  readonly count = computed(() => this.items().length);

  has(id: number): boolean {
    return this.items().some((movie) => movie.id === id);
  }

  add(movie: WishlistItem): void {
    if (this.has(movie.id)) {
      return;
    }
    const { id, title, poster_path } = movie;
    this.save([{ id, title, poster_path }, ...this.items()]);
  }

  remove(id: number): void {
    this.save(this.items().filter((movie) => movie.id !== id));
  }

  toggle(movie: WishlistItem): void {
    if (this.has(movie.id)) {
      this.remove(movie.id);
    } else {
      this.add(movie);
    }
  }

  private save(items: WishlistItem[]): void {
    this.items.set(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked: the list still works until the page is reloaded.
    }
  }

  /** Reads the saved list, ignoring anything that is not a valid movie. */
  private load(): WishlistItem[] {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(saved)) {
        return [];
      }
      return saved.filter(
        (item): item is WishlistItem =>
          typeof item?.id === 'number' && typeof item?.title === 'string',
      );
    } catch {
      return [];
    }
  }
}
