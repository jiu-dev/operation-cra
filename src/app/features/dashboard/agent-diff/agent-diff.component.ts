import { Component } from '@angular/core';
import { CraDaysLineComponent } from '../../../shared/components/cra-days-line/cra-days-line.component';

@Component({
  selector: 'app-agent-diff',
  standalone: true,
  imports: [CraDaysLineComponent],
  templateUrl: './agent-diff.component.html',
})
export class AgentDiffComponent {}
