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
import { AgentDiffState } from './agent-diff.type';

const initialState: AgentDiffState = {
  monthRange: -3,
  monthOffset: 0,
  header: [],
  lines: [],
  isLoading: false,
  selectedAgentKey: '',
};

export const AgentDiffStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ monthOffset, monthRange, lines }) => ({
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
  })),
  withHooks({
    onInit(store) {
      watchState(store, (state) => {
        console.log(state.lines);
      });
    },
  }),
);
