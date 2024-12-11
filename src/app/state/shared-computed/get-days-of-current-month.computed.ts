import { computed, Signal } from '@angular/core';
import { CraDayItem } from '../../core/interfaces/cra-day-item.interface';

export const getDaysOfCurrentMonth = (monthOffset: Signal<number>) => {
  return computed(() => {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth() + monthOffset();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: CraDayItem[] = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayKey = new Intl.DateTimeFormat('fr-FR', options).format(date);
      const letter = dayKey[0].toUpperCase();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      days.push({
        key: dayKey,
        letter,
        number: day,
        isWeekend,
      });
    }
    return days;
  });
};
