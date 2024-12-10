import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CraStore } from '../../../../state/cra/cra.store';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-month-picker',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './month-picker.component.html',
})
export class MonthPickerComponent {
  readonly craStore = inject(CraStore);
  @Input() currentMonthName = '';
  @Input() displayNext = true;
  @Input() displayPrev = true;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  handleNext(event: Event): void {
    this.next.emit();
    event.preventDefault();
  }

  handlePrev(event: Event): void {
    this.prev.emit();
    event.preventDefault();
  }
}
