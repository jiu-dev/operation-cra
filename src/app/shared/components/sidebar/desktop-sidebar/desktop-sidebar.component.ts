import { Component } from '@angular/core';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content.component';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  imports: [SidebarContentComponent],
  standalone: true,
  styleUrl: './desktop-sidebar.component.scss',
})
export class DesktopSidebarComponent {}
