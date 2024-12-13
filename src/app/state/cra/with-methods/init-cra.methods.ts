import { Injectable } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { Imputation } from '../../../core/interfaces/imputation.interface';
import { CommonCraMethods } from './common-methods';
import { LineState } from '../cra.type';
import { DateUtilsMethods } from '../../shared/with-methods/date-utils.methods';

@Injectable({
  providedIn: 'root',
})
export class InitCraMethods extends CommonCraMethods {
  constructor(private readonly dateUtils: DateUtilsMethods) {
    super();
  }

  initCra(store: any) {
    patchState(store, (state) => {
      return {
        ...state,
        header: this.dateUtils.initHeaderLine(store),
        lines: this.initLines(store),
      };
    });
  }

  getLineInputs(store: any, componentId: number) {
    const line = store
      .lines()
      .find((line: LineState) => line.id === componentId) as LineState;
    if (line) {
      if (line.inputs) {
        return line.inputs;
      }
      throw new Error(
        `There is no imputations bind to the component with the ID : ${componentId}`,
      );
    }
    throw new Error(
      `There is no activity bind to the component with the ID : ${componentId}`,
    );
  }

  private initLines(store: any) {
    const cra = store.cra();
    let currentImputations = cra.imputations;
    if (currentImputations.length === 0) {
      currentImputations = [this.createImputation(store, 0)];
    }

    return currentImputations
      .sort(
        (a: Imputation, b: Imputation) =>
          (a.componentId || 0) - (b.componentId || 0),
      )
      .map((imputation: Imputation) => {
        return {
          id: imputation.componentId,
          inputs: imputation.imputeTimes
            ? this.createLineInputs(store, imputation.imputeTimes)
            : [],
        };
      });
  }
}
