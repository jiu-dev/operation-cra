import { Component } from '@angular/core';
import { SidebarContainerComponent } from './shared/components/sidebar/sidebar-container/sidebar-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [SidebarContainerComponent],
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CRA-Management';
}
