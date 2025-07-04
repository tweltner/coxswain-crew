import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonApp, IonContent, IonMenu, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuComponent } from './menu/menu.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cwc-root',
  imports: [IonMenu, IonContent, HeaderComponent, IonApp, IonRouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'coxswain';
}
