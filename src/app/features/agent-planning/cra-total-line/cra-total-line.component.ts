import { Component, computed, inject } from '@angular/core';
import { CraStore } from '../../../state/cra/cra.store';
import { CraDaysLineComponent } from '../../../shared/components/cra-days-line/cra-days-line.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cra-total-line',
  standalone: true,
  imports: [CraDaysLineComponent, NgIf],
  templateUrl: './cra-total-line.component.html',
})
export class CraTotalLineComponent {
  readonly craStore = inject(CraStore);

  readonly totalLines = computed(() => {
    const imputationsSum = this.craStore.getImputationsSum();
    if (imputationsSum.length === 0) {
      return new Array(this.craStore.nbOfDays()).fill(0);
    }
    return imputationsSum;
  });

  readonly total = computed(() => {
    const imputationsSum = this.craStore.getImputationsSum();
    return imputationsSum.reduce((acc, current) => {
      return acc + current;
    }, 0);
  });
}
