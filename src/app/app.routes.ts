import { Routes } from '@angular/router';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { MovieList } from './components/movie-list/movie-list';
import { MovieSearch } from './components/movie-search/movie-search';
import { Wishlist } from './components/wishlist/wishlist';

export const routes: Routes = [
  { path: '', component: MovieList, title: 'Movie List' },
  { path: 'movie/:id', component: MovieDetail, title: 'Movie details' },
  { path: 'search/:title', component: MovieSearch, title: 'Search' },
  { path: 'wishlist', component: Wishlist, title: 'Wish list' },
  { path: '**', redirectTo: '' },
];
