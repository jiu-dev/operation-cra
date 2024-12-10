import { Component, Input } from '@angular/core';
import { Referential } from '../../../core/interfaces/referential.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.component.html',
  standalone: true,
})
export class AgentCardComponent {
  @Input() agent: Referential = { key: '', label: '' };

  constructor(private router: Router) {}

  updateCra() {
    this.router.navigate(['/agents', this.agent.key]);
  }
}
