import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuToggle,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  MenuController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'cwc-menu',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    RouterLink,
    IonRouterLink,
    IonMenuToggle,
    IonIcon,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private menuController = inject(MenuController);

  closeMenu() {
    /* empty */
  }
}
