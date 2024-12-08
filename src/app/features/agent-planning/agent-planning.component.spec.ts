import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPlanningComponent } from './agent-planning.component';

describe('AgentPlanningComponent', () => {
  let component: AgentPlanningComponent;
  let fixture: ComponentFixture<AgentPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPlanningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
