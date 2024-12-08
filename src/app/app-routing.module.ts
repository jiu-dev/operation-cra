import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
  },
  {
    path: 'agent/:id',
    loadChildren: () =>
      import('./features/agent-planning/agent-planning.module').then(
        (m) => m.AgentPlanningModule,
      ),
  },
  {
    path: 'missions',
    loadChildren: () =>
      import('./features/mission-manager/mission-manager.module').then(
        (m) => m.MissionManagerModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
