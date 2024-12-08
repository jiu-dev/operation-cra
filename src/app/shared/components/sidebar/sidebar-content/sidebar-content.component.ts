import { Component } from '@angular/core';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  imports: [SidebarLinkComponent, NgFor],
  standalone: true,
  styleUrl: './sidebar-content.component.scss',
})
export class SidebarContentComponent {
  links = [
    { href: '#', icon: 'dashboard', label: 'Tableau de bord', isActive: true },
    { href: '#', icon: 'team', label: 'Gestion des agents', isActive: false },
    { href: '#', icon: 'projects', label: 'Missions', isActive: false },
  ];

  teams = [
    { name: 'Heroicons', initial: 'H' },
    { name: 'Tailwind Labs', initial: 'T' },
    { name: 'Workcation', initial: 'W' },
  ];
}
