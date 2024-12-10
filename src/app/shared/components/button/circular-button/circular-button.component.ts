import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-circular-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './circular-button.component.html',
})
export class CircularButtonComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  get classes(): string {
    const sizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const variantClasses = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
      secondary:
        'bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50',
    };

    return `rounded-full ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-xs'
    }`;
  }

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.onClick.emit();
    }
    event.preventDefault();
  }
}
