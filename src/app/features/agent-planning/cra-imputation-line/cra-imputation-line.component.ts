import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
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
} from '@angular/forms';
import { ImputationInput } from '../../../core/interfaces/imputation-input.interface';

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
export class CraImputationLineComponent implements OnInit, OnChanges {
  @ViewChildren('dayInput') dayInputs!: QueryList<any>;
  readonly craStore = inject(CraStore);
  @Input() activities: Referential[] = [];
  @Input() id: number = 0;
  formGroup!: FormGroup;

  imputationInputs: ImputationInput[] = [];

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].isFirstChange()) {
      console.log(this.id);
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.imputationInputs = this.craStore.getImputationInputsById(this.id);
    this.formGroup = this.fb.group(
      this.imputationInputs.reduce(
        (acc: { [key: string]: FormControl }, input) => {
          acc[input.formControlName] = new FormControl(input.value);
          return acc;
        },
        {},
      ),
    );
    this.onImputationChange(this.formGroup.getRawValue());
    this.formGroup.valueChanges.subscribe((changes) => {
      this.onImputationChange(changes);
    });

    this.isActivitySelected();
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

  onImputationChange(values: { [key: string]: string }): void {
    const newImputation = { imputeTimes: this.transformInputs(values) };
    this.craStore.updateImputation(this.id, newImputation);
  }

  readonly isActivitySelected = computed(() => {
    const imputation = this.craStore.cra
      .imputations()
      .find((imputation) => imputation.componentId === this.id);
    if (imputation?.activityKey) {
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

  onDeleteActivity(): void {
    this.craStore.deleteLine(this.id);
  }

  isWeekend(key: string) {
    switch (key) {
      case FrDaysKey.Samedi:
      case FrDaysKey.Dimanche:
        return true;
      default:
        return false;
    }
  }
}
