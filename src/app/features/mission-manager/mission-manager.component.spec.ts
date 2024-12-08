import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionManagerComponent } from './mission-manager.component';

describe('MissionManagerComponent', () => {
  let component: MissionManagerComponent;
  let fixture: ComponentFixture<MissionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
