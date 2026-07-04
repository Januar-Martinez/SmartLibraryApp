import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  /*{
    path: 'guests',
    loadComponent: () =>
      import('./features/guests/guests.component').then((m) => m.GuestsComponent),
  },
  {
    path: 'rooms',
    loadComponent: () => import('./features/rooms/rooms.component').then((m) => m.RoomsComponent),
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./features/reservations/reservations.component').then((m) => m.ReservationsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },*/
];
