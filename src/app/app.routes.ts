import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./features/members/members.component').then((m) => m.MembersComponent),
  },
  {
    path: 'books',
    loadComponent: () => import('./features/books/books.component').then((m) => m.BooksComponent),
  },
  {
    path: 'loans',
    loadComponent: () => import('./features/loans/loans.component').then((m) => m.LoansComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
