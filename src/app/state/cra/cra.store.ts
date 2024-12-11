import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CraState } from './cra.type';
import { computed, inject } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';
import { ImputationInput } from '../../core/interfaces/imputation-input.interface';
import { Imputation } from '../../core/interfaces/imputation.interface';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { getWorkingDays } from '../shared-computed/get-working-days.computed';
import { getImputationsSum } from '../shared-computed/get-imputation-sum.computed';
import { canNavigate } from '../shared-computed/can-navigate.computed';
import { getCurrentMonthName } from '../shared-computed/get-current-month-name.computed';
import { getDaysOfCurrentMonth } from '../shared-computed/get-days-of-current-month.computed';

const initialCra = { imputations: [] };
const initialState: CraState = {
  monthRange: -3,
  monthOffset: 0,
  header: [],
  lines: [],
  isLoading: false,
  cra: { imputations: [] },
  selectedAgentKey: '',
};

export const CraStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ monthOffset, monthRange, cra, lines }) => ({
    canNavigate: canNavigate(monthOffset, monthRange),
    getCurrentMonthName: getCurrentMonthName(monthOffset),
    getWorkingDays: getWorkingDays(cra),
    getImputationsSum: getImputationsSum(cra),
    getDaysOfCurrentMonth: getDaysOfCurrentMonth(monthOffset),
    getMonthAndYearFromOffset: computed(() => {
      const current = new Date();
      const currentYear = current.getFullYear();
      const currentMonth = current.getMonth();
      const targetDate = new Date(currentYear, currentMonth + monthOffset(), 1);

      return {
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
      };
    }),
    nextAvailableLineID: computed(() => {
      const existingIds = lines().map((line) => line.id);
      const sortedIds = existingIds.sort((a, b) => a - b);
      let nextId = 0;
      for (let i = 0; i < sortedIds.length; i++) {
        if (sortedIds[i] !== i) {
          nextId = i;
          break;
        }
      }
      if (nextId === 0 && sortedIds.length > 0) {
        nextId = sortedIds.length;
      }
      return nextId;
    }),
  })),
  withMethods((store, agentService = inject(AgentService)) => ({
    updateMonthOffset(monthDirection: number) {
      patchState(store, (state) => {
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
    },
    initCra() {
      const imputationInputs = store.getDaysOfCurrentMonth().map((item) => {
        return {
          formControlName: item.number.toString(),
          isWeekEnd: item.isWeekend,
          value: '0',
        } as ImputationInput;
      });

      const cra = store.cra();
      const currentImputations = cra.imputations;
      console.log(cra);
      let newLines;
      console.log(currentImputations);
      if (currentImputations.length > 0) {
        console.log('jesuisla');
        newLines = currentImputations.map((imputation) => {
          const imputeTimes = imputation.imputeTimes;
          if (imputeTimes) {
            const newImputationInputs = imputeTimes.map((time, index) => ({
              formControlName: (index + 1).toString(),
              isWeekEnd: this.isWeekEnd(index + 1),
              value: time.toString(),
            }));
            return {
              id: imputation.componentId || 0,
              imputationInputs: newImputationInputs,
            };
          }
          return {
            id: imputation.componentId || 0,
            imputationInputs: [],
          };
        });
      } else {
        newLines = [{ id: 0, imputationInputs }];
      }

      console.log('newLines', newLines);
      patchState(store, (state) => {
        return {
          ...state,
          header: store.getDaysOfCurrentMonth(),
          lines: newLines,
        };
      });
    },
    getImputationInputsById(componentId: number) {
      const activity = store
        .lines()
        .find((activity) => activity.id === componentId);
      if (activity) {
        if (activity.imputationInputs) {
          return activity.imputationInputs;
        }
        throw new Error(
          `There is no imputations bind to the component with the ID : ${componentId}`,
        );
      }
      throw new Error(
        `There is no activity bind to the component with the ID : ${componentId}`,
      );
    },
    selectedActivity(componentId: number) {
      return store
        .cra()
        .imputations.find(
          (imputation) => imputation.componentId === componentId,
        )?.activityKey;
    },
    addLine() {
      const id = store.nextAvailableLineID();
      const imputationInputs = store.getDaysOfCurrentMonth().map((item) => {
        return {
          formControlName: item.number.toString(),
          isWeekEnd: item.isWeekend,
          value: '0',
        } as ImputationInput;
      });
      patchState(store, (state) => ({
        lines: [...state.lines, { id, imputationInputs }],
      }));
    },
    deleteLine(componentId: number) {
      this.deleteImputation(componentId);
      patchState(store, (state) => {
        return {
          lines: [...state.lines.filter((line) => line.id !== componentId)],
        };
      });
    },
    deleteImputation(componentId: number) {
      patchState(store, (state) => {
        const newImputation = state.cra.imputations.filter(
          (imputation) => imputation.componentId !== componentId,
        );
        return {
          ...state,
          cra: {
            ...state.cra,
            imputations: newImputation,
          },
        };
      });
    },
    resetRestDay() {
      patchState(store, (state) => {
        const restDayImputation = state.cra.imputations.find(
          (imputation) => imputation.activityKey === 'repos',
        );

        if (restDayImputation) {
          const updatedImputeTimes = restDayImputation.imputeTimes;
          const workingDays = store.getWorkingDays();
          if (updatedImputeTimes)
            workingDays.forEach((index) => (updatedImputeTimes[index] = 0));
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
    },
    resetWorkingDays(componentId: number, index: number) {
      patchState(store, (state) => {
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
    },
    updateImputation(componentId: number, newImputation: Imputation) {
      const current = store.cra
        .imputations()
        .find((imputation) => imputation.componentId);
      if (current?.activityKey !== 'repos') {
        this.resetRestDay();
      }

      patchState(store, (state) => {
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
    },
    selectAgent(key: string) {
      patchState(store, (state) => ({ ...state, selectedAgentKey: key }));
    },
    sendCra() {
      const craDate = store.getMonthAndYearFromOffset();
      const cra = {
        month: craDate.month,
        year: craDate.year,
        imputations: store.cra().imputations,
      };
      agentService.addCra(store.selectedAgentKey(), cra);
    },
    isWeekEnd(day: number) {
      const current = new Date();
      const year = current.getFullYear();
      const month = current.getMonth() + store.monthOffset();
      const date = new Date(year, month, day);
      return date.getDay() === 0 || date.getDay() === 6;
    },
    loadCraByAgentKey: rxMethod<{ agentKey: string; monthOffset: number }>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((emitValue) => {
          return agentService
            .getCrasByAgentKeyAndMonthOffset(
              emitValue.agentKey,
              emitValue.monthOffset,
            )
            .pipe(
              tapResponse({
                next: (cra) =>
                  patchState(store, (state) => ({
                    ...state,
                    cra: cra ? cra : initialCra,
                  })),
                error: console.error,
                finalize: () => {
                  patchState(store, { isLoading: false });
                },
              }),
            );
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log(state.cra);
        console.log(state.lines);
      });
    },
  }),
);
