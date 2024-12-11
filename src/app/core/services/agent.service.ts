import { Injectable } from '@angular/core';
import { Agent } from '../interfaces/agent.interface';
import { LocalStorageService } from './local-storage.service';
import { Cra } from '../interfaces/cra.interface';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private agents: Agent[] = [
    {
      id: 'jkdsvhskjbvsfhb',
      firstName: 'James',
      lastName: 'Bond',
      email: 'james.bond@gmail.com',
      cras: [],
    },
    {
      id: 'vhjksfkjvhfkjgh',
      firstName: 'Mata',
      lastName: 'Hari',
      email: '',
      cras: [],
    },
    {
      id: 'hjkfhsdjkghkgdd',
      firstName: 'Virginia',
      lastName: 'Hall',
      email: '',
      cras: [],
    },
  ];

  constructor(private localStorageService: LocalStorageService) {}

  async getAgent(id: string): Promise<Agent | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.agents.find((agent) => agent.id === id));
      }, 0);
    });
  }

  getCrasByAgentKeyAndMonthOffset(
    agentKey: string,
    monthOffset: number,
  ): Observable<Cra> {
    // Retrieve agents from localStorage
    const agents = this.localStorageService.getItem<Agent[]>('agents') || [];

    // Find the agent by the provided key
    const agent = agents.find((agent: Agent) => agent.id === agentKey);

    if (!agent) {
      // Throw an error if the agent is not found
      return throwError(
        () => new Error(`No agent found with key: ${agentKey}`),
      );
    }

    // Calculate the target date details (month and year)
    const { targetMonth, targetYear } = this.calculateTargetDate(monthOffset);

    // Filter CRAs by the target month and year
    const filteredCras = agent.cras.filter(
      (cra: Cra) => cra.month === targetMonth && cra.year === targetYear,
    );

    if (!filteredCras.length) {
      console.warn(
        `No CRA found for agent with key: ${agentKey} for month ${targetMonth}/${targetYear}`,
      );
    }

    // Log the filtered CRA
    console.log('Filtered CRA:', filteredCras[0]);

    // Return the first filtered CRA as an observable
    return of(filteredCras[0] || null); // Return null if no CRA is found
  }

  // Utility method to calculate the target date based on a month offset
  private calculateTargetDate(monthOffset: number): {
    targetMonth: number;
    targetYear: number;
  } {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthOffset);

    return {
      targetMonth: currentDate.getMonth() + 1, // Months are 0-based
      targetYear: currentDate.getFullYear(),
    };
  }

  getCrasByAgentKey(agentKey: string): Cra[] {
    // Retrieve agents from localStorage
    const agents = this.localStorageService.getItem<Agent[]>('agents') || [];

    // Find the agent by the provided key
    const agent = agents.find((agent: any) => agent.id === agentKey);

    // Throw an error if the agent is not found
    if (!agent) {
      throw new Error('No agent with this key');
    }

    // Return the CRA list for the agent
    return agent.cras;
  }

  async addCra(agentKey: string, cra: Cra) {
    const agent = this.agents.find((agent) => agent.id === agentKey);
    if (!agent) {
      throw new Error('No agent with this key');
    }
    // Vérifie si le CRA existe déjà
    const existIndex = agent.cras.findIndex(
      (item) => item.month === cra.month && item.year === cra.year,
    );
    if (existIndex !== -1) {
      // Met à jour le CRA existant
      agent.cras[existIndex] = cra;
    } else {
      // Ajoute un nouveau CRA
      agent.cras.push(cra);
    }
    // Met à jour la liste des agents
    this.agents = this.agents.map((item) =>
      item.id === agentKey ? { ...agent } : item,
    );
    // Enregistre dans le localStorage
    this.localStorageService.setItem('agents', this.agents);
  }
}
