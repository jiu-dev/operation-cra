import { Component, inject, OnInit } from '@angular/core';
import { AgentDiffStore } from '../../../state/agent-diff/agent-diff.store';
import { DiffLineComponent } from './diff-line/diff-line.component';
import { NgFor } from '@angular/common';
import { DiffHeaderLineComponent } from './diff-header-line/diff-header-line.component';

@Component({
  selector: 'app-agent-diff',
  standalone: true,
  imports: [DiffLineComponent, NgFor, DiffHeaderLineComponent],
  templateUrl: './agent-diff.component.html',
})
export class AgentDiffComponent implements OnInit {
  readonly agentDiffStore = inject(AgentDiffStore);
  readonly header = this.agentDiffStore.header;
  readonly monthOffSet = this.agentDiffStore.monthOffset;
  readonly agentLines = this.agentDiffStore.agentLines;

  ngOnInit(): void {
    this.agentDiffStore.loadAgentsWithCras(this.monthOffSet);
    this.agentDiffStore.onMonthOffsetChange(this.monthOffSet);
  }
}
