import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickAccessCard {
  label: string;
  link: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  quickAccess: QuickAccessCard[] = [
    {
      label: 'Miembros',
      link: '/members',
      icon: 'fa-solid fa-user-group',
      description:
        'Registra, consulta y administra la información de los miembros de la biblioteca.',
    },
    {
      label: 'Libros',
      link: '/books',
      icon: 'fa-solid fa-book-open',
      description: 'Gestiona el catálogo de libros, su disponibilidad y existencias.',
    },
    {
      label: 'Préstamos',
      link: '/loans',
      icon: 'fa-solid fa-book-bookmark',
      description: 'Controla los préstamos, devoluciones y el estado de cada ejemplar.',
    },
  ];
}
