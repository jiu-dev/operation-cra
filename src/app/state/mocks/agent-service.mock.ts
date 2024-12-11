import { delay, of } from 'rxjs';
import { agents } from './agent-data.mock';

export const MockAgentService = {
  getAllAgentsWithCrasByMonthOffset: jest.fn((monthOffset: number) =>
    of([monthOffset === 0 ? agents[0] : agents[1]]).pipe(delay(100)),
  ),
};
