import { computed, Signal } from '@angular/core';
import { FrMonthNames } from '../../core/enums/fr-months-name.enum';

export const getCurrentMonthName = (monthOffset: Signal<number>) => {
  return computed(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset());
    const monthIndex = date.getMonth();
    return Object.values(FrMonthNames)[monthIndex];
  });
};
