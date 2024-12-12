import { ImputationInput } from '../../../core/interfaces/imputation-input.interface';

export abstract class CommonCraMethods {
  _createLineInputs(store: any, existingImputations: number[]) {
    let lineInputs: ImputationInput[] = [];
    for (let i = 0; i < existingImputations.length; i++) {
      lineInputs.push({
        index: i.toString(),
        isWeekEnd: this._isWeekEnd(store, i + 1),
        value: existingImputations[i].toString(),
      });
    }
    return lineInputs;
  }

  _createDefaultLine(store: any, componentId: number) {
    const defaultImputeTimes = new Array(store.nbOfDays()).fill('0');
    const inputs = this._createLineInputs(store, defaultImputeTimes);
    return { id: componentId, inputs };
  }

  _isWeekEnd(store: any, day: number) {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth() + store.monthOffset();
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6;
  }
}
