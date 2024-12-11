import { Component, inject } from '@angular/core';
import { CraStore } from '../../../state/cra/cra.store';
import { BaseHeaderLineComponent } from '../../../core/abstracts/base-header-line.component';
import { HeaderLineComponent } from '../../../shared/components/header-line/header-line.component';

@Component({
  selector: 'app-cra-header-line',
  standalone: true,
  imports: [HeaderLineComponent],
  templateUrl: './cra-header-line.component.html',
})
export class CraHeaderLineComponent extends BaseHeaderLineComponent {
  readonly craStore = inject(CraStore);

  get currentMonthName(): string {
    return this.craStore.getCurrentMonthName();
  }

  get canNavigate(): { next: boolean; previous: boolean } {
    return this.craStore.canNavigate();
  }

  navigate(monthDirection: number): void {
    this.craStore.updateMonthOffset(monthDirection);
  }
}
