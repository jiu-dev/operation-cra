import { Injectable } from '@angular/core';
import { Referential } from '../interfaces/referential.interface';
import { LocalStorageService } from './local-storage.service';

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
        label: 'James Bond',
      },
      {
        key: 'vhjksfkjvhfkjgh',
        label: 'Mata Hari',
      },
      {
        key: 'hjkfhsdjkghkgdd',
        label: 'Virginia Hall',
      },
    ],
  };

  constructor(private localStorageService: LocalStorageService) {}

  async getAgents(): Promise<Referential[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.agents); // Simulate network latency
      }, 0);
    });
  }

  async getActivities(): Promise<Referential[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.activities); // Simulate network latency
      }, 0);
    });
  }

  saveReferentialsToLocalStorage(): void {
    try {
      const existingData = this.localStorageService.getItem('referentials');

      if (existingData) {
        console.log(
          'Referentials already exist in local storage:',
          existingData,
        );
      } else {
        this.localStorageService.setItem('referentials', this.mockData);
        console.log('Referentials saved to local storage successfully.');
      }
    } catch (error) {
      console.error('Failed to save referentials to local storage:', error);
    }
  }
}
