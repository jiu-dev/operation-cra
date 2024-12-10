import { Component, inject, Input, signal, Signal } from '@angular/core';
import { CraDaysLineComponent } from '../cra-days-line/cra-days-line.component';
import { CraDayItem } from '../../../core/interfaces/cra-day-item.interface';
import { MonthPickerComponent } from '../../../shared/components/calendar/month-picker/month-picker.component';
import { CraStore } from '../../../state/cra/cra.store';

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
