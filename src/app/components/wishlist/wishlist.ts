import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie.service';
import { WishlistItem, WishlistService } from '../../services/wishlist.service';

@Component({
  imports: [RouterLink, FontAwesomeModule],
  selector: 'app-wishlist',
  styleUrls: ['../movie-list/movie-list.css', './wishlist.css'],
  templateUrl: './wishlist.html',
})
export class Wishlist {
  private movieService = inject(MovieService);
  wishlist = inject(WishlistService);

  faHeart = faHeart;
  faTrash = faTrash;

  posterUrl(movie: WishlistItem): string {
    return this.movieService.getPosterUrl(movie.poster_path);
  }
}
