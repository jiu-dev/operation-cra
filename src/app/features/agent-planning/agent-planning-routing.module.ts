import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentPlanningComponent } from './agent-planning.component';

const routes: Routes = [
  {
    path: '',
    component: AgentPlanningComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentPlanningRoutingModule {}
