import { computed, Signal } from '@angular/core';

export const getMonthAndYearFromOffset = (monthOffset: Signal<number>) => {
  return computed(() => {
    const current = new Date();
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth();
    const targetDate = new Date(currentYear, currentMonth + monthOffset(), 1);

    return {
      month: targetDate.getMonth() + 1,
      year: targetDate.getFullYear(),
    };
  });
};
