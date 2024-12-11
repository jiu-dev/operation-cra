import { Agent } from '../../core/interfaces/agent.interface';

export enum agentIds {
  agent1 = 'jkdsvhskjbvsfhb',
  agent2 = 'vhjksfkjvhfkjgh',
  agent3 = 'hjkfhsdjkghkgdd',
}

export const agents: Agent[] = [
  {
    id: agentIds.agent1,
    firstName: 'James',
    lastName: 'Bond',
    email: 'james.bond@gmail.com',
    cras: [],
  },
  {
    id: agentIds.agent2,
    firstName: 'Mata',
    lastName: 'Hari',
    email: '',
    cras: [],
  },
  {
    id: agentIds.agent3,
    firstName: 'Virginia',
    lastName: 'Hall',
    email: '',
    cras: [],
  },
];

export const fullAgents = [
  {
    id: 'jkdsvhskjbvsfhb',
    firstName: 'James',
    lastName: 'Bond',
    email: 'james.bond@gmail.com',
    cras: [
      {
        month: 12,
        year: 2024,
        imputations: [
          {
            imputeTimes: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0,
              0, 7, 7, 0, 0, 0, 0, 7, 7,
            ],
            componentId: 0,
            activityKey: 'mission_1',
          },
          {
            imputeTimes: [
              0, 0, 7, 0, 7, 7, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 7, 0, 7, 0, 0, 0, 0, 0,
            ],
            componentId: 1,
            activityKey: 'mission_2',
          },
        ],
      },
      {
        month: 10,
        year: 2024,
        imputations: [
          {
            imputeTimes: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 7,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            componentId: 0,
            activityKey: 'mission_1',
          },
        ],
      },
      {
        month: 11,
        year: 2024,
        imputations: [
          {
            imputeTimes: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 7,
            ],
            componentId: 0,
            activityKey: 'mission_1',
          },
        ],
      },
    ],
  },
  {
    id: 'vhjksfkjvhfkjgh',
    firstName: 'Mata',
    lastName: 'Hari',
    email: '',
    cras: [
      {
        month: 12,
        year: 2024,
        imputations: [
          {
            imputeTimes: [
              0, 7, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            componentId: 0,
            activityKey: 'mission_2',
          },
        ],
      },
    ],
  },
  {
    id: 'hjkfhsdjkghkgdd',
    firstName: 'Virginia',
    lastName: 'Hall',
    email: '',
    cras: [],
  },
];
