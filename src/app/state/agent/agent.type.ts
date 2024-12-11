import { Cra } from '../../core/interfaces/cra.interface';

export interface AgentState {
  agentKey: string;
  personalInformations: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  cras: Cra[];
  isLoading: boolean;
}
