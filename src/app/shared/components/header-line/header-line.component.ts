import {
  Component,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CraDayItem } from '../../../core/interfaces/cra-day-item.interface';
import { CraDaysLineComponent } from '../cra-days-line/cra-days-line.component';
import { MonthPickerComponent } from '../calendar/month-picker/month-picker.component';

@Component({
  selector: 'app-header-line',
  imports: [CraDaysLineComponent, MonthPickerComponent],
  standalone: true,
  templateUrl: './header-line.component.html',
})
export class HeaderLineComponent {
  @Input() days: CraDayItem[] = [];
  @Input() currentMonthName: string = '';
  @Input() canNavigate: { next: boolean; previous: boolean } = {
    next: false,
    previous: false,
  };
  @Input() labelTemplate?: TemplateRef<any>;

  @Output() navigate = new EventEmitter<number>();
}
