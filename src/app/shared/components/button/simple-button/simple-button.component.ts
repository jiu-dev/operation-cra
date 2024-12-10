import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-simple-button',
  imports: [NgClass],
  standalone: true,
  templateUrl: './simple-button.component.html',
})
export class SimpleButtonComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  get classes(): string {
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2 py-1 text-sm',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-sm',
      xl: 'px-3.5 py-2.5 text-sm',
    };

    const variantClasses = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
      secondary:
        'bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50',
    };

    return `${sizeClasses[this.size]} ${variantClasses[this.variant]} ${
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
