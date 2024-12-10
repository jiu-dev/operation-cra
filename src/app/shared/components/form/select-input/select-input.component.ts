import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface SelectOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  imports: [NgIf, NgClass, NgFor],
  standalone: true,
})
export class SelectInputComponent {
  @Input() label: string | undefined;
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() selectedOption: SelectOption | null = null;

  hoveredIndex: number | null = null;

  @Output() optionSelected = new EventEmitter<SelectOption>();

  isExpanded = false;

  get labelId(): string {
    return `${this.label?.replace(/\s+/g, '-').toLowerCase()}-label`;
  }

  toggleDropdown(): void {
    this.isExpanded = !this.isExpanded;
  }

  selectOption(option: SelectOption): void {
    this.selectedOption = option;
    this.optionSelected.emit(option);
    this.isExpanded = false;
  }
}
