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
import { CraDaysLineComponent } from '../cra-days-line/cra-days-line.component';
import { SelectInputComponent } from '../../../shared/components/form/select-input/select-input.component';
import { Referential } from '../../../core/interfaces/referential.interface';
import { CraStore } from '../../../state/cra/cra.store';
import { CircularButtonComponent } from '../../../shared/components/button/circular-button/circular-button.component';
import { FrDaysKey } from '../../../core/enums/fr-days-name.enum';
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
import { pipe, tap } from 'rxjs';

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
  @Input() activities: Referential[] = [];
  @Input() id: number = 0;
  @Output() validityChange = new EventEmitter<boolean>();
  formGroup!: FormGroup;
  imputationInputs: ImputationInput[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.imputationInputs = this.craStore.getImputationInputsById(this.id);
    this.formGroup = this.fb.group(
      this.imputationInputs.reduce(
        (acc: { [key: string]: FormControl }, input) => {
          acc[input.formControlName] = new FormControl(input.value, [
            Validators.pattern('^[0-9]*$'),
          ]);
          return acc;
        },
        {},
      ),
    );
    this.sendImputation(this.formGroup.getRawValue());
    this.validityChange.emit(this.formGroup.valid);
    this.formGroup.statusChanges.subscribe(() => {
      this.validityChange.emit(this.formGroup.valid);
    });
    this.formGroup.valueChanges.subscribe((changes) => {
      const sanitizedChanges = Object.keys(changes).reduce(
        (acc: Record<string, string>, key) => {
          acc[key] =
            changes[key] === '' || isNaN(Number(changes[key]))
              ? 0
              : changes[key];
          return acc;
        },
        {},
      );

      this.formGroup.patchValue(sanitizedChanges, { emitEvent: false });
      this.sendImputation(sanitizedChanges);
    });
    this.isActivitySelected();
    this.onImputationChange(this.currentImputation);
  }

  getImputations() {
    return this.dayInputs.map((input) => ({
      dayKey: input.nativeElement.id,
      imputationTime: input.nativeElement.value,
    }));
  }

  onSelectActivity(activity: Referential): void {
    const newImputation = { activityKey: activity.key };
    this.craStore.updateImputation(this.id, newImputation);

    this.isActivitySelected();
  }

  sendImputation(values: { [key: string]: string }): void {
    const newImputation = { imputeTimes: this.transformInputs(values) };

    this.craStore.updateImputation(this.id, newImputation);
  }

  readonly currentImputation = computed(() => {
    return this.craStore.cra
      .imputations()
      .find((imputation) => imputation.componentId === this.id);
  });

  readonly onImputationChange = rxMethod<Imputation | undefined>(
    pipe(
      tap((imputation) => {
        if (imputation && imputation.imputeTimes) {
          if (imputation.activityKey === 'repos') {
            imputation.imputeTimes.forEach((imputeTime, index) => {
              if (imputeTime > 0) {
                this.craStore.resetWorkingDays(this.id, index);
              }
            });
          }
          this.formGroup.patchValue(
            this.reverseTransformInputs(imputation.imputeTimes),
            { emitEvent: false },
          );
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

  private transformInputs(values: { [key: string]: string }) {
    const result = [];
    for (const key in values) {
      result[parseInt(key, 10) - 1] = parseInt(values[key], 10);
    }
    return result;
  }

  private reverseTransformInputs(values: number[]): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    values.forEach((value, index) => {
      result[(index + 1).toString()] = value.toString();
    });
    return result;
  }

  onDeleteActivity(): void {
    this.craStore.deleteLine(this.id);
  }
}
