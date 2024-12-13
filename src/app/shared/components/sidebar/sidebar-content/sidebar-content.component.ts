import { Component, OnInit } from '@angular/core';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';
import { NgFor } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  imports: [SidebarLinkComponent, NgFor],
  standalone: true,
  styleUrl: './sidebar-content.component.scss',
})
export class SidebarContentComponent implements OnInit {
  links = [
    {
      href: '/dashboard',
      icon: 'dashboard',
      label: 'Synthèse',
      isActive: true,
    },
    {
      href: '/agents/jkdsvhskjbvsfhb',
      icon: 'team',
      label: 'James Bond',
      isActive: false,
    },
    {
      href: '/agents/vhjksfkjvhfkjgh',
      icon: 'team',
      label: 'Mata Hari',
      isActive: false,
    },
    {
      href: '/agents/hjkfhsdjkghkgdd',
      icon: 'team',
      label: 'Virginia Hall',
      isActive: false,
    },
  ];

  teams = [
    { name: 'Heroicons', initial: 'H' },
    { name: 'Tailwind Labs', initial: 'T' },
    { name: 'Workcation', initial: 'W' },
  ];
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;

        // Mettre à jour l'état `isActive` des liens
        this.links.forEach((link) => {
          link.isActive = currentUrl === link.href;
        });
      });

    // Vérification initiale
    const currentUrl = this.router.url;
    this.links.forEach((link) => {
      link.isActive = currentUrl === link.href;
    });
  }

  emptyLocalStorage() {
    this.localStorageService.clear();
  }
}
