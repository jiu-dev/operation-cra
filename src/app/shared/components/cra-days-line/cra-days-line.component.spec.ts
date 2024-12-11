import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CraDaysLineComponent } from './cra-days-line.component';

describe('CraDaysLineComponent', () => {
  let component: CraDaysLineComponent;
  let fixture: ComponentFixture<CraDaysLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraDaysLineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CraDaysLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
