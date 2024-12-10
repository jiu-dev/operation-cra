import { CraDayItem } from '../../core/interfaces/cra-day-item.interface';
import { Cra } from '../../core/interfaces/cra.interface';
import { ImputationInput } from '../../core/interfaces/imputation-input.interface';

export interface CraState {
  monthRange: number;
  monthOffset: number;
  header: CraDayItem[];
  lines: LineState[];
  cra: Cra;
  isLoading: boolean;
  selectedAgentKey: string;
}

export interface LineState {
  id: number;
  imputationInputs: ImputationInput[];
}
