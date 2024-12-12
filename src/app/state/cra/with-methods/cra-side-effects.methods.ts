import { patchState } from '@ngrx/signals';
import { Imputation } from '../../../core/interfaces/imputation.interface';
import { CraState } from '../cra.type';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CraSideEffectMethods {
  _resetDays(store: any, imputation: Imputation, index: number) {
    if (imputation.activityKey && imputation.componentId) {
      if (imputation.activityKey !== 'repos') {
        this._resetRestDay(store, index);
        console.log('Index is Reset', index);
      } else {
        this._resetWorkingDays(store, imputation.componentId, index);
        console.log('Index is Reset Working', index);
      }
    }
  }

  _resetRestDay(store: any, workDayIndex: number) {
    patchState(store, (state: CraState) => {
      let restDayImputation = state.cra.imputations.find(
        (imputation) => imputation.activityKey === 'repos',
      );
      if (restDayImputation) {
        const updatedImputeTimes = restDayImputation.imputeTimes;
        if (updatedImputeTimes) {
          updatedImputeTimes[workDayIndex] = 0;
        }
        const updatedImputations = state.cra.imputations.map((imputation) => {
          if (imputation.activityKey === 'repos') {
            return {
              ...imputation,
              imputeTimes: updatedImputeTimes,
            };
          }
          return imputation;
        });
        return {
          cra: {
            ...state.cra,
            imputations: updatedImputations,
          },
        };
      }
      return state;
    });
  }

  _resetWorkingDays(store: any, componentId: number, index: number) {
    patchState(store, (state: CraState) => {
      const updatedImputations = state.cra.imputations.map((imputation) => {
        if (imputation.componentId !== componentId) {
          const updatedImputeTimes = imputation.imputeTimes
            ? [...imputation.imputeTimes]
            : [];
          if (updatedImputeTimes[index] !== undefined) {
            updatedImputeTimes[index] = 0;
          }
          return {
            ...imputation,
            imputeTimes: updatedImputeTimes,
          };
        }
        return imputation;
      });

      return {
        ...state,
        cra: {
          ...state.cra,
          imputations: updatedImputations,
        },
      };
    });
  }
}
