import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffLineComponent } from './diff-line.component';

describe('DiffLineComponent', () => {
  let component: DiffLineComponent;
  let fixture: ComponentFixture<DiffLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
