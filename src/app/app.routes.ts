import { Routes } from '@angular/router';
import { AgentPlanningComponent } from './features/agent-planning/agent-planning.component';

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
    component: AgentPlanningComponent,
  },
  {
    path: 'missions',
    loadComponent: () =>
      import('./features/mission-manager/mission-manager.component').then(
        (m) => m.MissionManagerComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
