import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundTemp',
  standalone: true,
})
export class RoundTempPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value === 'number') {
      return `${Math.round(value)}`;
    }

    return 'Dati non disponibili';
  }
}
