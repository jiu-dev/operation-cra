import { CraDayItem } from '../../core/interfaces/cra-day-item.interface';

export interface AgentDiffState {
  monthRange: number;
  monthOffset: number;
  header: CraDayItem[];
  lines: AgentDiffLineState[];
  isLoading: boolean;
  selectedAgentKey: string;
}

export interface AgentDiffLineState {
  agentKey: string;
}
