import { Component, inject, Input } from '@angular/core';
import { CraDayItem } from '../../../core/interfaces/cra-day-item.interface';
import { MonthPickerComponent } from '../../../shared/components/calendar/month-picker/month-picker.component';
import { CraStore } from '../../../state/cra/cra.store';
import { CraDaysLineComponent } from '../../../shared/components/cra-days-line/cra-days-line.component';

@Component({
  selector: 'app-cra-header-line',
  standalone: true,
  imports: [CraDaysLineComponent, MonthPickerComponent],
  templateUrl: './cra-header-line.component.html',
})
export class CraHeaderLineComponent {
  readonly craStore = inject(CraStore);
  @Input() days: CraDayItem[] = [];

  readonly currentMonthName = this.craStore.getCurrentMonthName;
  readonly canNavigate = this.craStore.canNavigate;

  navigate(monthDirection: number) {
    this.craStore.updateMonthOffset(monthDirection);
  }
}
