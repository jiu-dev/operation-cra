import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CraImputationLineComponent } from './cra-imputation-line.component';
import { CraStore } from '../../../state/cra/cra.store';
import { ReferentialStore } from '../../../state/referential/referential.store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Referential } from '../../../core/interfaces/referential.interface';
import { ImputationInput } from '../../../core/interfaces/imputation-input.interface';

describe('CraImputationLineComponent', () => {
  let component: CraImputationLineComponent;
  let fixture: ComponentFixture<CraImputationLineComponent>;
  let mockCraStore: any;
  let mockReferentialStore: any;

  beforeEach(async () => {
    // const updateImputation = jest.fn<void, [Signal<Cra>]>();
    mockCraStore = {
      selectedActivity: signal(''),
      getImputationInputsById: signal(new Array<ImputationInput>()),
      updateImputation: jest.fn(),
      deleteLine: jest.fn(),
      resetWorkingDays: jest.fn(),
      cra: {
        imputations: signal(new Array<ImputationInput>()),
      },
    };

    mockReferentialStore = {
      activities: signal(new Array<Referential>()),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CraImputationLineComponent],
      providers: [
        { provide: CraStore, useValue: mockCraStore },
        { provide: ReferentialStore, useValue: mockReferentialStore },
        FormBuilder,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CraImputationLineComponent);
    component = fixture.componentInstance;
    component.id = 1;
    component.activities = [{ key: 'activity1', label: 'Activity 1' }];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit validity status on form changes', () => {
  //   const spy = jest.spyOn(component.validityChange, 'emit');
  //   component.formGroup.get('1')?.setValue('5');
  //   expect(spy).toHaveBeenCalledWith(true);
  // });

  it('should call craStore.updateImputation when activity is selected', () => {
    const activity = { key: 'newActivity', label: 'New Activity' };
    component.onSelectActivity(activity);
    expect(mockCraStore.updateImputation).toHaveBeenCalledWith(1, {
      activityKey: 'newActivity',
    });
  });

  it('should disable the form if no activity is selected', () => {
    jest.spyOn(mockCraStore.cra, 'imputations').mockReturnValue([]);
    component.isActivitySelected();
    expect(component.formGroup.disabled).toBe(true);
  });

  // it('should send imputation when form values change', () => {
  //   const spy = jest.spyOn(component, 'sendImputation');
  //   component.formGroup.get('1')?.setValue('3');
  //   expect(spy).toHaveBeenCalledWith({ 1: '3', 2: '0' });
  // });

  it('should delete the activity line on delete', () => {
    component.onDeleteActivity();
    expect(mockCraStore.deleteLine).toHaveBeenCalledWith(1);
  });
});
