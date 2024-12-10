import { Injectable } from '@angular/core';
import { Agent } from '../interfaces/agent.interface';
import { LocalStorageService } from './local-storage.service';
import { Cra } from '../interfaces/cra.interface';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private agents: Agent[] = [
    {
      id: 'jkdsvhskjbvsfhb',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      cras: [],
    },
    {
      id: 'vhjksfkjvhfkjgh',
      firstName: 'Antoine',
      lastName: 'Marechal',
      email: '',
      cras: [],
    },
    {
      id: 'hjkfhsdjkghkgdd',
      firstName: 'James',
      lastName: 'Web',
      email: '',
      cras: [],
    },
  ];

  constructor(private localStorageService: LocalStorageService) {}

  async getAgent(id: string): Promise<Agent | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.agents.find((agent) => agent.id === id));
      }, 500);
    });
  }

  async addCra(key: string, cra: Cra) {
    const agent = this.agents.find((agent) => agent.id === key);
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
      item.id === key ? { ...agent } : item,
    );
    // Enregistre dans le localStorage
    this.localStorageService.setItem('agents', this.agents);
  }
}
