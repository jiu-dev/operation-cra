import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-link',
  templateUrl: './sidebar-link.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrl: './sidebar-link.component.scss',
})
export class SidebarLinkComponent {
  @Input() href!: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() isActive = false;
}
