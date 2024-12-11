import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AgentService } from '../../core/services/agent.service';
import { MockAgentService } from '../mocks/agent-service.mock';
import { AgentDiffStore } from './agent-diff.store';
import { agents } from '../mocks/agent-data.mock';
import { MockAgentDiffStore } from '../mocks/agent-diff-store.mock';
import { expectedAgentLines } from '../mocks/expected/agent-lines.expected';
import { expectedCanNavigate } from '../mocks/expected/can-navigate.expected';

describe('AgentDiffStore', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AgentService,
          useValue: MockAgentService,
        },
      ],
    });

    return TestBed.inject(AgentDiffStore);
  };

  it('should load two times', fakeAsync(() => {
    const store = setup();

    const monthOffset$ = new Subject<number>();
    store.loadAgentsWithCras(monthOffset$);
    monthOffset$.next(0);

    tick(100);
    expect(store.agents()).toEqual([agents[0]]);

    monthOffset$.next(1);
    tick(100);
    expect(store.agents()).toEqual([agents[1]]);
  }));

  it('should cancel a running request when a new one is made', fakeAsync(() => {
    const store = setup();

    const monthOffset$ = new Subject<number>();
    store.loadAgentsWithCras(monthOffset$);
    monthOffset$.next(0);

    tick(50);
    monthOffset$.next(1);

    tick(50);
    expect(store.agents()).toEqual([]);

    tick(50);
    expect(store.agents()).toEqual([agents[1]]);
  }));

  it('should return formatted agent lines.', () => {
    const store = TestBed.inject(MockAgentDiffStore);
    expect(store.agentLines().toString()).toBe(expectedAgentLines.toString());
  });

  it('should return whether navigation is possible.', () => {
    const store = TestBed.inject(MockAgentDiffStore);
    expect(store.canNavigate().toString()).toBe(expectedCanNavigate.toString());
  });

  // it('should return the current month name based on the offset.', () => {
  //   const store = TestBed.inject(MockAgentDiffStore);
  //   console.log(store.getCurrentMonthName());
  //   expect(store.getCurrentMonthName().toString()).toBe('');
  // });
  //
  // it('should return the days of the current month based on the offset.', () => {
  //   const store = TestBed.inject(MockAgentDiffStore);
  //   console.log(store.getDaysOfCurrentMonth());
  //   expect(store.getDaysOfCurrentMonth().toString()).toBe('');
  // });
  //
  // it('should return the month and year from offset.', () => {
  //   const store = TestBed.inject(MockAgentDiffStore);
  //   console.log(store.getMonthAndYearFromOffset());
  //   expect(store.getMonthAndYearFromOffset().toString()).toBe('');
  // });
});
