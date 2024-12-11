import { DeepSignal } from '@ngrx/signals';
import { computed } from '@angular/core';

export const alertLine = (alertLines: DeepSignal<number[][]>) => {
  return computed(() => {
    const length = alertLines()[0]?.length || 0;
    const memoSum = new Array(length).fill(0);
    for (const line of alertLines()) {
      for (let i = 0; i < length; i++) {
        memoSum[i] += line[i];
      }
    }
    return memoSum;
  });
};
