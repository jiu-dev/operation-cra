import { Cra } from './cra.interface';

export interface Agent {
  id?: string;
  lastName: string;
  firstName: string;
  email?: string;
  cras: Cra[];
}
