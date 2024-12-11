import { Component, inject, Input } from '@angular/core';
import { CraDayItem } from '../../../../core/interfaces/cra-day-item.interface';
import { AgentDiffStore } from '../../../../state/agent-diff/agent-diff.store';
import { CraDaysLineComponent } from '../../../../shared/components/cra-days-line/cra-days-line.component';
import { MonthPickerComponent } from '../../../../shared/components/calendar/month-picker/month-picker.component';

@Component({
  selector: 'app-diff-header-line',
  standalone: true,
  imports: [MonthPickerComponent, CraDaysLineComponent],
  templateUrl: './diff-header-line.component.html',
})
export class DiffHeaderLineComponent {
  readonly agentDiffStore = inject(AgentDiffStore);
  @Input() days: CraDayItem[] = [];

  readonly currentMonthName = this.agentDiffStore.getCurrentMonthName;
  readonly canNavigate = this.agentDiffStore.canNavigate;

  navigate(monthDirection: number) {
    console.log('hjdkvhjkdsfhjkbhjkfd');
    this.agentDiffStore.updateMonthOffset(monthDirection);
  }
}
