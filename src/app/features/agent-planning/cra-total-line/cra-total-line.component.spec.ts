import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraTotalLineComponent } from './cra-total-line.component';

describe('CraTotalLineComponent', () => {
  let component: CraTotalLineComponent;
  let fixture: ComponentFixture<CraTotalLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraTotalLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraTotalLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
