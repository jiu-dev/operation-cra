import {
  Component,
  computed,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CraStore } from '../../state/cra/cra.store';
import { CraHeaderLineComponent } from './cra-header-line/cra-header-line.component';
import { CraImputationLineComponent } from './cra-imputation-line/cra-imputation-line.component';
import { SimpleButtonComponent } from '../../shared/components/button/simple-button/simple-button.component';
import { NgFor } from '@angular/common';
import { ReferentialStore } from '../../state/referential/referential.store';
import { AgentSelectorComponent } from './agent-selector/agent-selector.component';
import { ActivatedRoute } from '@angular/router';
import { pipe, Subscription, tap } from 'rxjs';
import { AgentStore } from '../../state/agent/agent.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CraTotalLineComponent } from './cra-total-line/cra-total-line.component';

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
export class AgentPlanningComponent {
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

  formsValidity: boolean[] = [];

  readonly canAddLine = computed(() => {
    return (
      this.craLines().length > 0 &&
      this.craLines().length === this.refActivities().length
    );
  });

  private readonly updateCra = rxMethod<number>(
    pipe(tap(() => this.craStore.initCra())),
  );

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
    this.updateCra(this.craStore.monthOffset);
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
  }
}
