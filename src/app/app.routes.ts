import { Routes } from '@angular/router';
import { AgentPlanningComponent } from './features/agent-planning/agent-planning.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'agents/:key',
    component: AgentPlanningComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
