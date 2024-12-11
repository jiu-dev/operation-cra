import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'agents/:key',

    loadComponent: () =>
      import('./features/agent-planning/agent-planning.component').then(
        (m) => m.AgentPlanningComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
