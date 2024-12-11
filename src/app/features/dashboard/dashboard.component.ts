import { Component, inject } from '@angular/core';
import { AgentCardComponent } from './agent-card/agent-card.component';
import { ReferentialStore } from '../../state/referential/referential.store';
import { NgFor } from '@angular/common';
import { AgentDiffComponent } from './agent-diff/agent-diff.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgentCardComponent, AgentDiffComponent, NgFor],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly referentialStore = inject(ReferentialStore);
  readonly agents = this.referentialStore.agents;

  ngOnInit() {
    this.referentialStore.loadAgents();
  }
}
