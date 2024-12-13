import { ImputationInput } from '../../../core/interfaces/imputation-input.interface';

export abstract class CommonCraMethods {
  createLineInputs(store: any, imputation: number[]) {
    let lineInputs: ImputationInput[] = [];
    for (let i = 0; i < imputation.length; i++) {
      lineInputs.push({
        index: i.toString(),
        isWeekEnd: this._isWeekEnd(store, i + 1),
        value: imputation[i].toString(),
      });
    }
    return lineInputs;
  }

  createImputation(store: any, componentId: number) {
    return {
      componentId: componentId,
      imputeTimes: new Array(store.nbOfDays()).fill(0),
    };
  }

  _isWeekEnd(store: any, day: number) {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth() + store.monthOffset();
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6;
  }
}
