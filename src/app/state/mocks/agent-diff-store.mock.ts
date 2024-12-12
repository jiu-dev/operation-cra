import { signalStore, withComputed, withState } from '@ngrx/signals';
import { AgentDiffState } from '../agent-diff/agent-diff.type';
import { fullAgents } from './agent-data.mock';
import { canNavigate } from '../shared-computed/can-navigate.computed';
import { getCurrentMonthName } from '../shared-computed/get-current-month-name.computed';
import { getDaysOfCurrentMonth } from '../shared-computed/init-header-line.computed';
import { getMonthAndYearFromOffset } from '../agent-diff/with-computed/get-month-and-year-from-offset.computed';
import { agentLines } from '../agent-diff/with-computed/agent-lines.computed';

export const MockAgentDiffStore = signalStore(
  { providedIn: 'root' },
  withState<AgentDiffState>({
    monthRange: -3,
    monthOffset: 0,
    header: [],
    lines: [],
    agents: fullAgents,
    isLoading: false,
    selectedAgentKey: '',
  }),
  withComputed(({ monthOffset, monthRange, agents }) => ({
    canNavigate: canNavigate(monthOffset, monthRange),
    getCurrentMonthName: getCurrentMonthName(monthOffset),
    getDaysOfCurrentMonth: getDaysOfCurrentMonth(monthOffset),
    getMonthAndYearFromOffset: getMonthAndYearFromOffset(monthOffset),
    agentLines: agentLines(agents),
  })),
);
