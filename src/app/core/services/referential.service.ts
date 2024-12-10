import { Injectable } from '@angular/core';
import { Referential } from '../interfaces/referential.interface';

@Injectable({
  providedIn: 'root',
})
export class ReferentialService {
  private mockData = {
    activities: [
      {
        key: 'mission_1',
        label: 'Mission Alpha',
      },
      {
        key: 'mission_2',
        label: 'Mission Beta',
      },
      {
        key: 'mission_3',
        label: 'Mission Omega',
      },
      {
        key: 'repos',
        label: 'Repos',
      },
    ],
    agents: [
      {
        key: 'jkdsvhskjbvsfhb',
        label: 'John Doe',
      },
      {
        key: 'vhjksfkjvhfkjgh',
        label: 'Antoine Marechal',
      },
      {
        key: 'hjkfhsdjkghkgdd',
        label: 'James Web',
      },
    ],
  };

  constructor() {}

  async getAgents(): Promise<Referential[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.agents); // Simulate network latency
      }, 500);
    });
  }

  async getActivities(): Promise<Referential[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.activities); // Simulate network latency
      }, 500);
    });
  }
}
