import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';
import { canNavigate } from '../shared-computed/can-navigate.computed';
import { getCurrentMonthName } from '../shared-computed/get-current-month-name.computed';
import { AgentDiffState } from './agent-diff.type';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { agentLines } from './with-computed/agent-lines.computed';
import { getMonthAndYearFromOffset } from './with-computed/get-month-and-year-from-offset.computed';
import { DateUtilsMethods } from '../shared/with-methods/date-utils.methods';

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
    getMonthAndYearFromOffset: getMonthAndYearFromOffset(monthOffset),
    agentLines: agentLines(agents),
  })),
  withMethods(
    (
      store,
      agentService = inject(AgentService),
      dateUtilsMethods = inject(DateUtilsMethods),
    ) => ({
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
          tap(() =>
            patchState(store, {
              header: dateUtilsMethods.initHeaderLine(store),
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
    }),
  ),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        state.monthOffset;
      });
    },
  }),
);
