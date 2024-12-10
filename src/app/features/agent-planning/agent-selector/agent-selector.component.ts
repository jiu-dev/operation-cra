import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { SelectInputComponent } from '../../../shared/components/form/select-input/select-input.component';
import { AgentStore } from '../../../state/agent/agent.store';
import { ReferentialStore } from '../../../state/referential/referential.store';
import { Referential } from '../../../core/interfaces/referential.interface';
import { CraStore } from '../../../state/cra/cra.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  imports: [SelectInputComponent],
  templateUrl: './agent-selector.component.html',
})
export class AgentSelectorComponent implements OnInit {
  readonly agentStore = inject(AgentStore);
  readonly referentialStore = inject(ReferentialStore);
  readonly craStore = inject(CraStore);
  readonly refAgents = this.referentialStore.agents;
  readonly agentFullName = this.agentStore.getFullName;

  constructor(private router: Router) {}

  ngOnInit() {
    this.referentialStore.loadAgents();
  }

  onSelectAgents(agent: Referential) {
    this.router.navigate(['/agents', agent.key]);
  }
}
