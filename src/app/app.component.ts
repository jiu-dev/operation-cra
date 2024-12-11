import { Component, OnInit } from '@angular/core';
import { SidebarContainerComponent } from './shared/components/sidebar/sidebar-container/sidebar-container.component';
import { RouterOutlet } from '@angular/router';
import { ReferentialService } from './core/services/referential.service';
import { AgentService } from './core/services/agent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [SidebarContainerComponent, RouterOutlet],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly referentialService: ReferentialService,
    private readonly agentService: AgentService,
  ) {}
  ngOnInit(): void {
    this.referentialService.saveReferentialsToLocalStorage();
    this.agentService.saveAgentsInLocalStorage();
  }
}
