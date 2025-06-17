import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { DateService } from './date.service';

@Pipe({
  name: 'swedishDate',
  standalone: true
})
export class SwedishDatePipe implements PipeTransform {
  
  constructor(private dateService: DateService) {}

  transform(epochMillis: number | null, format: string = 'yyyy-MM-dd HH:mm'): string {
    if (!epochMillis) {
      return '';
    }

    const dateTime = this.dateService.fromBackendEpoch(epochMillis);
    
    // Format according to the provided format string
    return dateTime.toFormat(format);
  }
}