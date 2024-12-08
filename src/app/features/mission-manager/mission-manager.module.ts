import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionManagerRoutingModule } from './mission-manager-routing.module';
import { MissionManagerComponent } from './mission-manager.component';

@NgModule({
  declarations: [MissionManagerComponent],
  imports: [CommonModule, MissionManagerRoutingModule],
})
export class MissionManagerModule {}
