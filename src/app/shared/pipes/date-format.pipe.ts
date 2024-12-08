import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(
    value: string | Date | number,
    format: string = 'dd/MM/yyyy',
  ): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      console.error('Invalid date provided to DateFormatPipe:', value);
      return '';
    }

    switch (format) {
      case 'dd/MM/yyyy':
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);

      case 'MM/dd/yyyy':
        return new Intl.DateTimeFormat('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(date);

      case 'yyyy-MM-dd':
        return date.toISOString().split('T')[0];

      default:
        console.warn(`Unknown date format: ${format}. Using default.`);
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
    }
  }
}
