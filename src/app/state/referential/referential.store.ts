import { SignalStore } from '@ngrx/signal-store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReferentialStore extends SignalStore<ReferentialState> {
  constructor() {
    super({
      agents: [],
      activities: [],
      timeUnit: 'days',
    });
  }

  setAgents(agents: Agent[]) {
    this.update((state) => ({ ...state, agents }));
  }

  setActivities(activities: Activity[]) {
    this.update((state) => ({ ...state, activities }));
  }

  setTimeUnit(unit: 'days' | 'hours') {
    this.update((state) => ({ ...state, timeUnit: unit }));
  }
}
