import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MENU_CONFIG } from './menu.config';
import { MenuItem } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class NavbarComponent {
  menuItems: MenuItem[] = MENU_CONFIG;
}
