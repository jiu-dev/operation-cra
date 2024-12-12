import { Component, computed, inject, OnInit, Pipe } from '@angular/core';
import { AgentDiffStore } from '../../../state/agent-diff/agent-diff.store';
import { DiffLineComponent } from './diff-line/diff-line.component';
import { NgFor } from '@angular/common';
import { DiffHeaderLineComponent } from './diff-header-line/diff-header-line.component';
import { AgentDiffLineState } from '../../../state/agent-diff/agent-diff.type';

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

  readonly alertLine = computed(() => {
    const lines = this.agentLines();
    const alertLines = lines.map((line) => line.imputation);
    const length = alertLines[0]?.length || 0;
    const memoSum = new Array(length).fill(0);

    for (const line of alertLines) {
      for (let i = 0; i < length; i++) {
        memoSum[i] += line[i];
      }
    }
    return {
      agentKey: 'total',
      agentName: 'Comparaison',
      imputation: memoSum,
      isCompare: true,
    } as AgentDiffLineState;
  });
}
