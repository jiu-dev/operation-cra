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
import {
  combineLatest,
  distinctUntilChanged,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { getWorkingDays } from '../shared-computed/get-working-days.computed';
import { getImputationsSum } from '../shared-computed/get-imputation-sum.computed';
import { canNavigate } from '../shared-computed/can-navigate.computed';
import { getCurrentMonthName } from '../shared-computed/get-current-month-name.computed';
import { toObservable } from '@angular/core/rxjs-interop';
import { InitCraMethods } from './with-methods/init-cra.methods';
import { CraUserActionMethods } from './with-methods/cra-user-action.methods';

const initialCra = { imputations: [] };
const initialState: CraState = {
  monthRange: -3,
  monthOffset: 0,
  header: [],
  lines: [],
  isLoading: false,
  cra: initialCra,
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
    nbOfDays: computed(() => {
      const current = new Date();
      const year = current.getFullYear();
      const month = current.getMonth() + monthOffset();
      return new Date(year, month + 1, 0).getDate();
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
  })),
  withMethods(
    (
      store,
      agentService = inject(AgentService),
      initCraMethods = inject(InitCraMethods),
      craUserActionMethods = inject(CraUserActionMethods),
    ) => ({
      updateMonthOffset(monthDirection: number) {
        craUserActionMethods.updateMonthOffset(store, monthDirection);
      },
      initCra() {
        initCraMethods.initCra(store);
      },
      getLineInputs(componentId: number) {
        return initCraMethods.getLineInputs(store, componentId);
      },
      selectedActivity(componentId: number) {
        return craUserActionMethods.selectedActivity(store, componentId);
      },
      addLine() {
        return craUserActionMethods.addLine(store);
      },
      deleteLine(componentId: number) {
        return craUserActionMethods.deleteLine(store, componentId);
      },
      deleteImputation(componentId: number) {
        craUserActionMethods.deleteImputation(store, componentId);
      },
      initImputations() {},
      updateActivity(componentId: number, activityKey: string) {
        craUserActionMethods.updateImputation(store, componentId, {
          activityKey,
        });
      },
      updateImputeTimes(componentId: number, imputeTimes: number[]) {
        craUserActionMethods.updateImputation(store, componentId, {
          imputeTimes,
        });
      },
      updateImputeTime(componentId: number, index: number, imputeTime: number) {
        craUserActionMethods.updateImputeTime(
          store,
          componentId,
          index,
          imputeTime,
        );
      },
      selectAgent(key: string) {
        craUserActionMethods.selectAgent(store, key);
      },
      sendCra() {
        craUserActionMethods.sendCra(store);
      },
      _isWeekEnd(day: number) {
        return initCraMethods._isWeekEnd(store, day);
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
    }),
  ),
  withHooks({
    onInit(store) {
      const monthOffset$ = toObservable(store.monthOffset);
      const agentKey$ = toObservable(store.selectedAgentKey);
      combineLatest([monthOffset$, agentKey$]).subscribe(
        ([monthOffset, agentKey]) => {
          store.loadCraByAgentKey({ agentKey, monthOffset });
          store.initCra();
        },
      );
      watchState(store, (state) => {
        // console.log(state.lines);
      });
    },
  }),
);
