import { Component, inject } from '@angular/core';
import { CraDaysLineComponent } from '../cra-days-line/cra-days-line.component';
import { CraStore } from '../../../state/cra/cra.store';

@Component({
  selector: 'app-cra-total-line',
  standalone: true,
  imports: [CraDaysLineComponent],
  templateUrl: './cra-total-line.component.html',
})
export class CraTotalLineComponent {
  readonly craStore = inject(CraStore);
}
