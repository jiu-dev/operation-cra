import { Cra } from '../../core/interfaces/cra.interface';

export interface AgentState {
  personalInformations: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  cras: Cra[];
  isLoading: boolean;
}
