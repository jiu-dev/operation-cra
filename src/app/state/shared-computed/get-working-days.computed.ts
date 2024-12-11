import { computed } from '@angular/core';
import { Cra } from '../../core/interfaces/cra.interface';
import { DeepSignal } from '@ngrx/signals';

export const getWorkingDays = (cra: DeepSignal<Cra>) => {
  return computed(() => {
    const imputeTimesArray = cra.imputations();
    const filteredArray = imputeTimesArray
      .filter((imputation) => imputation.activityKey === 'repos')
      .map((imputation) => imputation.imputeTimes)
      .filter((imputeTime) => imputeTime !== undefined);
    const workingDays = [];

    for (const imputeTime of filteredArray) {
      for (let i = 0; i < imputeTime.length; i++) {
        if (imputeTime[i] !== 0) {
          workingDays.push(i);
        }
      }
    }
    console.log(workingDays);
    return workingDays;
  });
};
