import {
  Component,
  computed,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CraStore } from '../../state/cra/cra.store';
import { CraImputationLineComponent } from './cra-imputation-line/cra-imputation-line.component';
import { SimpleButtonComponent } from '../../shared/components/button/simple-button/simple-button.component';
import { NgFor } from '@angular/common';
import { ReferentialStore } from '../../state/referential/referential.store';
import { AgentSelectorComponent } from './agent-selector/agent-selector.component';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, Subscription, takeUntil } from 'rxjs';
import { AgentStore } from '../../state/agent/agent.store';
import { CraTotalLineComponent } from './cra-total-line/cra-total-line.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { CraHeaderLineComponent } from '../../shared/components/cra-header-line/cra-header-line.component';

@Component({
  selector: 'app-agent-planning',
  standalone: true,
  imports: [
    AgentSelectorComponent,
    CraHeaderLineComponent,
    CraImputationLineComponent,
    NgFor,
    SimpleButtonComponent,
    CraTotalLineComponent,
  ],
  templateUrl: './agent-planning.component.html',
})
export class AgentPlanningComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChildren(CraImputationLineComponent)
  craImputationComponents!: QueryList<CraImputationLineComponent>;

  readonly craStore = inject(CraStore);
  readonly referentialStore = inject(ReferentialStore);
  readonly agentStore = inject(AgentStore);
  readonly craHeader = this.craStore.header;
  readonly craLines = this.craStore.lines;
  readonly refActivities = this.referentialStore.activities;
  readonly activities = computed(() => {
    const keys = this.craStore.cra
      .imputations()
      .filter((imputation) => imputation.activityKey !== undefined)
      .map((imputation) => imputation.activityKey!);
    return this.refActivities().filter(
      (activity) => !keys.includes(activity.key),
    );
  });

  readonly monthOffset$ = toObservable(this.craStore.monthOffset);
  readonly agentKey$ = toObservable(this.craStore.selectedAgentKey);
  formsValidity: boolean[] = [];

  readonly canAddLine = computed(() => {
    return (
      this.craLines().length > 0 &&
      this.craLines().length === this.refActivities().length
    );
  });

  private routeSubscription!: Subscription;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const agentKey = paramMap.get('key');
      if (agentKey) {
        this.craStore.selectAgent(agentKey);
        this.agentStore.loadAgent(agentKey);
      }
    });
    this.referentialStore.loadActivities();
    combineLatest([this.monthOffset$, this.agentKey$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([monthOffset, agentKey]) => {
        console.log(`Mois: ${monthOffset}, Agent: ${agentKey}`);
        this.craStore.loadCraByAgentKey({ agentKey, monthOffset });
        this.craStore.initCra();
      });
  }

  get allFormsValid(): boolean {
    return this.formsValidity.every((isValid) => isValid);
  }

  onChildValidityChange(index: number, isValid: boolean): void {
    this.formsValidity[index] = isValid;
  }
  validateCra(): void {
    this.craStore.sendCra();
  }

  addImputationLine(): void {
    this.craStore.addLine();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
