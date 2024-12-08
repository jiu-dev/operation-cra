import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionManagerComponent } from './mission-manager.component';

const routes: Routes = [
  {
    path: '',
    component: MissionManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionManagerRoutingModule {}
