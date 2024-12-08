import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.scss',
})
export class SidebarHeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
}
