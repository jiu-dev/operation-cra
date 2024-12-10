import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AgentState } from './agent.type';
import { AgentService } from '../../core/services/agent.service';
import { computed, inject } from '@angular/core';

const initialState: AgentState = {
  personalInformations: {
    firstName: '',
    lastName: '',
  },
  cras: [],
  isLoading: false,
};
export const AgentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ personalInformations }) => ({
    getFullName: computed(
      () =>
        `${personalInformations().firstName} ${personalInformations().lastName}`,
    ),
  })),
  withMethods((store, agentService = inject(AgentService)) => ({
    async loadAgent(id: string): Promise<void> {
      patchState(store, { isLoading: true });
      const agent = await agentService.getAgent(id);
      if (agent)
        patchState(store, {
          personalInformations: {
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
          },
          cras: agent.cras,
          isLoading: false,
        });
    },
  })),
);
