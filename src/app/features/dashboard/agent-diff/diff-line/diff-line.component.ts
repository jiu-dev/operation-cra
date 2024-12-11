import { Component, Input } from '@angular/core';
import { CraDaysLineComponent } from '../../../../shared/components/cra-days-line/cra-days-line.component';
import { AgentDiffLineState } from '../../../../state/agent-diff/agent-diff.type';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-diff-line',
  standalone: true,
  imports: [CraDaysLineComponent, NgIf, NgClass],
  templateUrl: './diff-line.component.html',
})
export class DiffLineComponent {
  @Input() agentLine: AgentDiffLineState = {
    agentKey: '',
    agentName: '',
    imputation: [],
  };
}
