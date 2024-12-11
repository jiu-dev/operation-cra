import { Component, inject } from '@angular/core';
import { CraStore } from '../../../state/cra/cra.store';
import { CraDaysLineComponent } from '../../../shared/components/cra-days-line/cra-days-line.component';

@Component({
  selector: 'app-cra-total-line',
  standalone: true,
  imports: [CraDaysLineComponent],
  templateUrl: './cra-total-line.component.html',
})
export class CraTotalLineComponent {
  readonly craStore = inject(CraStore);
}
