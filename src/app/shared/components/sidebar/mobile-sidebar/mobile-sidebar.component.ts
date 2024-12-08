import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content.component';

@Component({
  selector: 'app-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  imports: [SidebarContentComponent],
  standalone: true,
  styleUrl: './mobile-sidebar.component.scss',
})
export class MobileSidebarComponent {
  @Output() close = new EventEmitter<void>();
}
