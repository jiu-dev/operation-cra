import {
  deepComputed,
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
import { CraDayItem } from '../../core/interfaces/cra-day-item.interface';
import { FrMonthNames } from '../../core/enums/fr-months-name.enum';
import { AgentService } from '../../core/services/agent.service';
import { ImputationInput } from '../../core/interfaces/imputation-input.interface';
import { Imputation } from '../../core/interfaces/imputation.interface';

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
    canNavigate: computed(() => {
      const offset = monthOffset();
      const range = monthRange();

      const previous = range < 0 ? offset - 1 > range : offset > 0;
      const next = range < 0 ? offset < 0 : offset + 1 < range;

      return { previous, next };
    }),
    getCurrentMonthName: computed(() => {
      const date = new Date();
      date.setMonth(date.getMonth() + monthOffset());
      const monthIndex = date.getMonth();
      return Object.values(FrMonthNames)[monthIndex];
    }),
    getWorkingDays: computed(() => {
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
    }),
    getImputationsSum: computed(() => {
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
    }),
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

    getDaysOfCurrentMonth: deepComputed(() => {
      const current = new Date();
      const year = current.getFullYear();
      const month = current.getMonth() + monthOffset();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days: CraDayItem[] = [];
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayKey = new Intl.DateTimeFormat('fr-FR', options).format(date);
        const letter = dayKey[0].toUpperCase();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        days.push({
          key: dayKey,
          letter,
          number: day,
          isWeekend,
        });
      }
      return days;
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
      this.resetCra();
      const imputationInputs = store.getDaysOfCurrentMonth().map((item) => {
        return {
          formControlName: item.number.toString(),
          isWeekEnd: item.isWeekend,
          value: item.isWeekend ? '0' : '1',
        } as ImputationInput;
      });
      patchState(store, (state) => {
        return {
          ...state,
          header: store.getDaysOfCurrentMonth(),
          lines: [{ id: 0, imputationInputs }],
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
    resetCra() {
      patchState(store, (state) => ({ ...state, cra: { imputations: [] } }));
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
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {});
    },
  }),
);
