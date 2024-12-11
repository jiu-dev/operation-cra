import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';
import { canNavigate } from '../shared-computed/can-navigate.computed';
import { getCurrentMonthName } from '../shared-computed/get-current-month-name.computed';
import { getDaysOfCurrentMonth } from '../shared-computed/get-days-of-current-month.computed';
import { AgentDiffLineState, AgentDiffState } from './agent-diff.type';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

const initialState: AgentDiffState = {
  monthRange: -3,
  monthOffset: 0,
  header: [],
  lines: [],
  agents: [],
  isLoading: false,
  selectedAgentKey: '',
};

export const AgentDiffStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ monthOffset, monthRange, agents }) => ({
    canNavigate: canNavigate(monthOffset, monthRange),
    getCurrentMonthName: getCurrentMonthName(monthOffset),
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
    agentLines: computed(() => {
      return agents().map((agent) => {
        const imputation = agent.cras.map((cra) => {
          const imputeTimesArray = cra.imputations
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
        })[0];
        return {
          agentKey: agent.id || '',
          agentName: `${agent.firstName} ${agent.lastName}` || '',
          imputation: imputation || [],
        } as AgentDiffLineState;
      });
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
    onMonthOffsetChange: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        tap(() => console.log('hvkjdvhjkrv')),
        tap(() =>
          patchState(store, {
            header: store.getDaysOfCurrentMonth(),
          }),
        ),
      ),
    ),
    loadAgentsWithCras: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((monthOffset) => {
          return agentService
            .getAllAgentsWithCrasByMonthOffset(monthOffset)
            .pipe(
              tapResponse({
                next: (agents) => patchState(store, { agents }),
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
        state.monthOffset;
      });
    },
  }),
);
