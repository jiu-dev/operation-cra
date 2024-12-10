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
import { CraUtil } from '../../core/utils/cra.util';
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

  validateCra(): void {
    // const activities = this.craImputationComponents.map((component) => {
    //   const key = this.craStore.getActivityKeyById(component.id);
    //   return {
    //     activityKey: key || '',
    //     imputationArray: component.getImputations().map((item) => {
    //       return item.imputationTime;
    //     }),
    //   };
    // });
    // const restDayErrors = CraUtil.validateRestDays(activities, 'repos');
    // const effortErrors = CraUtil.validateEffort(activities, 2);
    //
    // const hasRestDayErrors = Object.values(restDayErrors).some(
    //   (indexes) => indexes.length > 0,
    // );
    // const hasEffortErrors = Object.values(effortErrors).some(
    //   (indexes) => indexes.length > 0,
    // );
    //
    // if (hasRestDayErrors || hasEffortErrors) {
    //   console.log('Il y a au moins une erreur dans les validations.');
    //   console.log(effortErrors);
    // } else {
    //   console.log('Aucune erreur détectée.');
    // }

    const imputationMetadatas = this.craImputationComponents.map(
      (component) => {
        return {
          lineId: component.id,
          imputationArray: CraUtil.createImputationArray(
            component.getImputations(),
          ),
        };
      },
    );
    this.craStore.sendCra(imputationMetadatas);
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
