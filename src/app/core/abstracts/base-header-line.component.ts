import { Directive, Input } from '@angular/core';
import { CraDayItem } from '../interfaces/cra-day-item.interface';

@Directive()
export abstract class BaseHeaderLineComponent {
  @Input() days: CraDayItem[] = [];
  abstract get currentMonthName(): string;
  abstract get canNavigate(): { next: boolean; previous: boolean };
  abstract navigate(monthDirection: number): void;
}
