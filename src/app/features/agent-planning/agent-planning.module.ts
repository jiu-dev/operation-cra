import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentPlanningRoutingModule } from './agent-planning-routing.module';
import { AgentPlanningComponent } from './agent-planning.component';

@NgModule({
  declarations: [AgentPlanningComponent],
  imports: [CommonModule, AgentPlanningRoutingModule],
  providers: [],
})
export class AgentPlanningModule {}
