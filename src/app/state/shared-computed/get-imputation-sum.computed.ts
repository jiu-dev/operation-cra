import { DeepSignal } from '@ngrx/signals';
import { Cra } from '../../core/interfaces/cra.interface';
import { computed } from '@angular/core';

export const getImputationsSum = (cra: DeepSignal<Cra>) => {
  return computed(() => {
    const imputeTimesArray = cra
      .imputations()
      .filter((imputation) => imputation.activityKey !== 'repos')
      .map((imputation) => imputation.imputeTimes)
      .filter((imputeTime) => imputeTime !== undefined);
    const length = imputeTimesArray[0]?.length || 0;
    const imputationsSum = new Array(length).fill(0);
    for (const imputeTime of imputeTimesArray) {
      for (let i = 0; i < length; i++) {
        imputationsSum[i] += imputeTime[i];
      }
    }
    return imputationsSum;
  });
};
