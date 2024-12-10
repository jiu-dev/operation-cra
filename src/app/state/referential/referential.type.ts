import { Referential } from '../../core/interfaces/referential.interface';

export type ReferentialState = {
  agents: Referential[];
  activities: Referential[];
  isLoading: boolean;
};
