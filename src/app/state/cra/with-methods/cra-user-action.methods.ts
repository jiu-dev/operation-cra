import { patchState } from '@ngrx/signals';
import { CommonCraMethods } from './common-methods';
import { Imputation } from '../../../core/interfaces/imputation.interface';
import { CraState } from '../cra.type';
import { AgentService } from '../../../core/services/agent.service';
import { Injectable } from '@angular/core';
import { CraSideEffectMethods } from './cra-side-effects.methods';

@Injectable({
  providedIn: 'root',
})
export class CraUserActionMethods extends CommonCraMethods {
  constructor(
    private readonly agentService: AgentService,
    private readonly craSideEffect: CraSideEffectMethods,
  ) {
    super();
  }

  updateMonthOffset(store: any, monthDirection: number) {
    patchState(store, (state: CraState) => {
      const newMonthOffset = state.monthOffset + monthDirection;
      const range = state.monthRange;
      if (
        (range < 0 && newMonthOffset === range) ||
        (range > 0 && newMonthOffset === range)
      ) {
        return state;
      }
      return { ...state, monthOffset: newMonthOffset };
    });
  }

  selectedActivity(store: any, componentId: number) {
    return store
      .cra()
      .imputations.find(
        (imputation: Imputation) => imputation.componentId === componentId,
      )?.activityKey;
  }

  addLine(store: any) {
    const componentId = store.nextAvailableLineID();
    const newImputation = this.createImputation(store, componentId);
    const newLine = {
      id: componentId,
      inputs: this.createLineInputs(store, newImputation.imputeTimes),
    };
    patchState(store, (state: CraState) => ({
      cra: {
        ...state.cra,
        imputations: [...state.cra.imputations, newImputation],
      },
      lines: [...state.lines, newLine],
    }));
  }

  deleteLine(store: any, componentId: number) {
    this.deleteImputation(store, componentId);
    patchState(store, (state: CraState) => {
      return {
        lines: [...state.lines.filter((line) => line.id !== componentId)],
      };
    });
  }

  deleteImputation(store: any, componentId: number) {
    patchState(store, (state: CraState) => {
      const newImputation = state.cra.imputations.filter(
        (imputation: Imputation) => imputation.componentId !== componentId,
      );
      return {
        ...state,
        cra: {
          ...state.cra,
          imputations: newImputation,
        },
      };
    });
  }

  updateImputeTime(
    store: any,
    componentId: number,
    index: number,
    imputeTime: number,
  ) {
    console.log(`[${componentId}] : IDX : ${index}, Time : ${imputeTime}`);
    console.log(imputeTime);
    let currentImputation = store.cra
      .imputations()
      .find((imputation: Imputation) => imputation.componentId === componentId);
    console.log(currentImputation);
    if (
      currentImputation?.imputeTimes &&
      currentImputation?.imputeTimes.length > 0
    ) {
    } else {
      currentImputation.imputeTimes = new Array(store.nbOfDays()).fill(0);
    }
    currentImputation.imputeTimes[index] = imputeTime;
    this.updateImputation(store, componentId, currentImputation);
    this.craSideEffect.resetDays(store, currentImputation, index);
  }

  selectAgent(store: any, key: string) {
    patchState(store, (state) => ({ ...state, selectedAgentKey: key }));
  }

  sendCra(store: any) {
    const craDate = store.getMonthAndYearFromOffset();
    const cra = {
      month: craDate.month,
      year: craDate.year,
      imputations: store.cra().imputations,
    };
    this.agentService.addCra(store.selectedAgentKey(), cra);
  }

  updateImputation(store: any, componentId: number, newImputation: Imputation) {
    patchState(store, (state: CraState) => {
      let imputations = state.cra.imputations;
      const imputation = imputations.find(
        (imputation) => imputation.componentId === componentId,
      );
      if (imputation) {
        imputations = imputations.filter(
          (item) => item.componentId !== componentId,
        );
        newImputation = {
          ...imputation,
          ...newImputation,
        };
      } else {
        newImputation = {
          ...newImputation,
          componentId,
        };
      }
      imputations.push(newImputation);
      return {
        cra: {
          imputations: [...imputations],
        },
      };
    });
  }
}
