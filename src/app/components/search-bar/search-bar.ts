import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [FontAwesomeModule],
  selector: 'app-search-bar',
  styleUrl: './search-bar.css',
  templateUrl: './search-bar.html',
})
export class SearchBar {
  private router = inject(Router);

  faMagnifyingGlass = faMagnifyingGlass;

  /** Sends the typed title to the parent component (movie-list). */
  titleChange = output<string>();

  /** Called on every (input) event of the search box. */
  searchMovieByTitle(title: string): void {
    this.titleChange.emit(title);
  }

  /** Enter key: open the full search results page. */
  openSearchPage(title: string): void {
    const query = title.trim();
    if (query) {
      this.router.navigate(['/search', query]);
    }
  }
}
