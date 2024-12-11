import { computed } from '@angular/core';
import { Cra } from '../../core/interfaces/cra.interface';
import { DeepSignal } from '@ngrx/signals';

export const getWorkingDays = (cra: DeepSignal<Cra>) => {
  return computed(() => {
    const imputeTimesArray = cra
      .imputations()
      .filter((imputation) => imputation.activityKey === 'repos')
      .map((imputation) => imputation.imputeTimes)
      .filter((imputeTime) => imputeTime !== undefined);
    const workingDays = [];
    for (const imputeTime of imputeTimesArray) {
      for (let i = 0; i < imputeTime.length; i++) {
        if (imputeTime[i] !== 0) {
          workingDays.push(i);
        }
      }
    }
    return workingDays;
  });
};
