import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { SelectInputComponent } from '../../../shared/components/form/select-input/select-input.component';
import { Referential } from '../../../core/interfaces/referential.interface';
import { CraStore } from '../../../state/cra/cra.store';
import { CircularButtonComponent } from '../../../shared/components/button/circular-button/circular-button.component';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImputationInput } from '../../../core/interfaces/imputation-input.interface';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Imputation } from '../../../core/interfaces/imputation.interface';
import { map, pairwise, pipe, tap } from 'rxjs';
import { ReferentialStore } from '../../../state/referential/referential.store';
import { CraDaysLineComponent } from '../../../shared/components/cra-days-line/cra-days-line.component';

@Component({
  selector: 'app-cra-imputation-line',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    CraDaysLineComponent,
    SelectInputComponent,
    CircularButtonComponent,
  ],
  templateUrl: './cra-imputation-line.component.html',
})
export class CraImputationLineComponent implements OnInit {
  @ViewChildren('dayInput') dayInputs!: QueryList<any>;
  readonly craStore = inject(CraStore);
  readonly refStore = inject(ReferentialStore);
  @Input() activities: Referential[] = [];
  @Input() componentId: number = 0;
  @Output() validityChange = new EventEmitter<boolean>();
  formGroup!: FormGroup;
  lineInputs: ImputationInput[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  readonly selectedOption = computed(() => {
    const activityKey = this.craStore.selectedActivity(this.componentId);
    const referential = this.refStore
      .activities()
      .find((ref) => ref.key === activityKey);
    return {
      key: referential?.key || '',
      label: referential?.label || '',
    };
  });

  private initializeForm(): void {
    this.lineInputs = this.craStore.getLineInputs(this.componentId);
    this.formGroup = this.fb.group(
      this.lineInputs.reduce((acc: { [key: string]: FormControl }, input) => {
        acc[input.index] = new FormControl(input.value, [
          Validators.pattern('^[0-9]*$'),
        ]);
        return acc;
      }, {}),
    );
    this.formGroup.valueChanges.subscribe((changes) => {
      const sanitizedChanges = Object.keys(changes).reduce(
        (acc: Record<string, string>, key) => {
          const value = changes[key];
          acc[key] =
            value === '' || isNaN(Number(value))
              ? '0'
              : Math.min(Number(value), 7).toString();
          return acc;
        },
        {},
      );
      this.formGroup.patchValue(sanitizedChanges, { emitEvent: false });
    });
    this.isActivitySelected();
    this.onImputationChange(this.currentImputation);
  }

  onSelectActivity(activity: Referential): void {
    this.craStore.updateActivity(this.componentId, activity.key);
    this.isActivitySelected();
  }

  onImputeTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const index = inputElement.getAttribute('data-key');
    const value = inputElement.value;
    if (index) {
      this.craStore.updateImputeTime(
        this.componentId,
        parseInt(index, 10),
        parseInt(value, 10),
      );
    }
  }

  readonly currentImputation = computed(() => {
    return this.craStore.cra
      .imputations()
      .find((imputation) => imputation.componentId === this.componentId);
  });

  readonly onImputationChange = rxMethod<Imputation | undefined>(
    pipe(
      tap((imputation) => {
        if (imputation?.imputeTimes) {
          this.renderImputation(imputation.imputeTimes);
        }
      }),
    ),
  );

  readonly isActivitySelected = computed(() => {
    if (this.currentImputation()?.activityKey) {
      return this.formGroup.enable();
    }
    return this.formGroup.disable();
  });

  private renderImputation(values: number[]): void {
    const result: { [key: string]: string } = {};
    values.forEach((value, index) => {
      result[index.toString()] = value.toString();
    });
    this.formGroup.patchValue(result, { emitEvent: false });
  }

  onDeleteActivity(): void {
    this.craStore.deleteLine(this.componentId);
  }
}
