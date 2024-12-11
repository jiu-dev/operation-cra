import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffHeaderLineComponent } from './diff-header-line.component';

describe('DiffHeaderLineComponent', () => {
  let component: DiffHeaderLineComponent;
  let fixture: ComponentFixture<DiffHeaderLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffHeaderLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffHeaderLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
