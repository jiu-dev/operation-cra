import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraImputationLineComponent } from './cra-imputation-line.component';

describe('CraImputationLineComponent', () => {
  let component: CraImputationLineComponent;
  let fixture: ComponentFixture<CraImputationLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraImputationLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraImputationLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
