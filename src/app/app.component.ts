import { Component } from '@angular/core';
import { SidebarContainerComponent } from './shared/components/sidebar/sidebar-container/sidebar-container.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [SidebarContainerComponent, RouterOutlet],
  standalone: true,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CRA-Management';
}
