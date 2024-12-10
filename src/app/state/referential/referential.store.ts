import {
  patchState,
  signalStore,
  watchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ReferentialState } from './referential.type';
import { inject } from '@angular/core';
import { ReferentialService } from '../../core/services/referential.service';

const initialState: ReferentialState = {
  agents: [],
  activities: [],
  isLoading: false,
};

export const ReferentialStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, referentialService = inject(ReferentialService)) => ({
    async loadActivities(): Promise<void> {
      patchState(store, { isLoading: true });
      const agents = await referentialService.getAgents();
      const activities = await referentialService.getActivities();
      patchState(store, {
        agents,
        activities,
        isLoading: false,
      });
    },
    async loadAgents(): Promise<void> {
      patchState(store, { isLoading: true });
      const agents = await referentialService.getAgents();
      patchState(store, {
        agents,
        isLoading: false,
      });
    },
  })),
);
