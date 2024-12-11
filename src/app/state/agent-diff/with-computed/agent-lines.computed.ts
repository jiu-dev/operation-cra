import { computed, Signal } from '@angular/core';
import { Agent } from '../../../core/interfaces/agent.interface';
import { AgentDiffLineState } from '../agent-diff.type';

export const agentLines = (agents: Signal<Agent[]>) => {
  return computed(() => {
    return agents().map((agent) => {
      const imputation = agent.cras.map((cra) => {
        const imputeTimesArray = cra.imputations
          .filter((imputation) => imputation.activityKey !== 'repos')
          .map((imputation) => imputation.imputeTimes)
          .filter((imputeTime) => imputeTime !== undefined);
        const length = imputeTimesArray[0]?.length || 0;
        const imputationsSum = new Array(length).fill(0);
        for (const imputeTime of imputeTimesArray) {
          for (let i = 0; i < length; i++) {
            imputationsSum[i] += imputeTime[i];
          }
        }
        return imputationsSum;
      })[0];
      return {
        agentKey: agent.id || '',
        agentName: `${agent.firstName} ${agent.lastName}` || '',
        imputation: imputation || [],
        isCompare: false,
      } as AgentDiffLineState;
    });
  });
};
