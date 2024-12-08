import { Component } from '@angular/core';
import { DesktopSidebarComponent } from '../desktop-sidebar/desktop-sidebar.component';
import { MobileSidebarComponent } from '../mobile-sidebar/mobile-sidebar.component';
import { NgIf } from '@angular/common';
import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header.component';

@Component({
  selector: 'app-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  imports: [
    MobileSidebarComponent,
    DesktopSidebarComponent,
    NgIf,
    SidebarHeaderComponent,
  ],
  standalone: true,
  styleUrl: './sidebar-container.component.scss',
})
export class SidebarContainerComponent {
  showSidebar = false;

  toggleSidebar(show: boolean) {
    console.log(show);
    this.showSidebar = show;
  }
}
