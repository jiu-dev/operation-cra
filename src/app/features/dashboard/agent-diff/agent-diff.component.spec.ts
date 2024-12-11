import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDiffComponent } from './agent-diff.component';

describe('AgentDiffComponent', () => {
  let component: AgentDiffComponent;
  let fixture: ComponentFixture<AgentDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentDiffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
