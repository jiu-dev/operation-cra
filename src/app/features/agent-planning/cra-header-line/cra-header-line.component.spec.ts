import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraHeaderLineComponent } from './cra-header-line.component';

describe('CraHeaderLineComponent', () => {
  let component: CraHeaderLineComponent;
  let fixture: ComponentFixture<CraHeaderLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraHeaderLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraHeaderLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
