import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ModalComponent } from './components/modal/modal.component';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [CalendarComponent, ModalComponent, DateFormatPipe],
  imports: [CommonModule],
  exports: [CalendarComponent, ModalComponent, DateFormatPipe, CommonModule],
})
export class SharedModule {}
