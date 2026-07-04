import { MenuItem } from '../models/menu.model';

export const MENU_CONFIG: MenuItem[] = [
  {
    type: 'normal',
    label: 'Inicio',
    link: '/',
  },
  {
    type: 'normal',
    label: 'Miembros',
    link: '/members',
  },
  {
    type: 'normal',
    label: 'Libros',
    link: '/books',
  },
  {
    type: 'normal',
    label: 'Préstamos',
    link: '/loans',
  },
];
