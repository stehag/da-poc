import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwedishDatePipe } from './swedish-date.pipe';
import { DateService } from './date.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SwedishDatePipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'timepoc';

  // Sample data from your backend
  sampleData = [
    {
      "dtoClass": "DateFieldDTO",
      "techKey": "ProjectStartDate",
      "longValue": 1750284000000
    },
    {
      "dtoClass": "DateFieldDTO", 
      "techKey": "ProjectEndDate",
      "longValue": 1750370400000
    }
  ];

  constructor(public dateService: DateService) {}

  // For debugging - show what these epochs represent in different timezones
  getDebugInfo(epochMillis: number) {
    return {
      epoch: epochMillis,
      swedishTime: this.dateService.epochToSwedishTime(epochMillis).toISO(),
      userTime: this.dateService.epochToUserTime(epochMillis).toISO(),
      userTimezone: this.dateService.getUserTimezone()
    };
  }
}
