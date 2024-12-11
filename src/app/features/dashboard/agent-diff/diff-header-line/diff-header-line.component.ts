import { Component, inject, Input } from '@angular/core';
import { AgentDiffStore } from '../../../../state/agent-diff/agent-diff.store';
import { BaseHeaderLineComponent } from '../../../../core/abstracts/base-header-line.component';
import { HeaderLineComponent } from '../../../../shared/components/header-line/header-line.component';

@Component({
  selector: 'app-diff-header-line',
  standalone: true,
  imports: [HeaderLineComponent],
  templateUrl: './diff-header-line.component.html',
})
export class DiffHeaderLineComponent extends BaseHeaderLineComponent {
  private readonly agentDiffStore = inject(AgentDiffStore);

  get currentMonthName(): string {
    return this.agentDiffStore.getCurrentMonthName();
  }

  get canNavigate(): { next: boolean; previous: boolean } {
    return this.agentDiffStore.canNavigate();
  }

  navigate(monthDirection: number): void {
    this.agentDiffStore.updateMonthOffset(monthDirection);
  }
}
