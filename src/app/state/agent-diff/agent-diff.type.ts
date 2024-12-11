import { Agent } from '../../core/interfaces/agent.interface';
import { CraDayItem } from '../../core/interfaces/cra-day-item.interface';

export interface AgentDiffState {
  monthRange: number;
  monthOffset: number;
  header: CraDayItem[];
  lines: AgentDiffLineState[];
  agents: Agent[];
  isLoading: boolean;
  selectedAgentKey: string;
}

export interface AgentDiffLineState {
  agentKey: string;
  agentName: string;
  imputation: number[];
}
