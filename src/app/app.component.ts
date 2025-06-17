import { Component } from '@angular/core';
import { SwedishDatePipe } from './swedish-date.pipe';
import { DateService } from './date.service';
import { CommonModule } from '@angular/common';
import { TimezoneDisplayComponent } from './timezone-display.component';
import { DeadlineDisplayComponent } from './deadline-display.component';
import { SwedishDatePickerComponent } from './swedish-date-picker.component';
import { SwedishDeadlineInfoComponent } from './swedish-deadline-info.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from './luxon-date-adapter';

const LUXON_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-root',
  imports: [
    SwedishDatePipe, 
    CommonModule,
    TimezoneDisplayComponent,
    DeadlineDisplayComponent,
    SwedishDatePickerComponent,
    SwedishDeadlineInfoComponent,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
    { provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS }
  ],
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

  // Date picker form control
  dateControl = new FormControl<DateTime | null>(null);
  selectedDateInfo: any = null;
  
  // Current timestamp for timezone display (updates every second)
  currentTimestamp = Date.now();
  
  // Custom timestamp input
  customTimestampControl = new FormControl<number | null>(null);
  isLiveTime = true;
  
  // Deadline configuration
  deadlineDate = '2025-06-18';
  deadlineTime = '23:59';

  constructor(public dateService: DateService) {
    // Watch for date changes
    this.dateControl.valueChanges.subscribe(date => {
      if (date) {
        this.updateSelectedDateInfo(date);
      } else {
        this.selectedDateInfo = null;
      }
    });

    // Update timestamp every second for live timezone display
    setInterval(() => {
      if (this.isLiveTime) {
        this.currentTimestamp = Date.now();
      }
    }, 1000);

    // Watch for custom timestamp changes
    this.customTimestampControl.valueChanges.subscribe(timestamp => {
      if (timestamp && timestamp > 0) {
        this.currentTimestamp = timestamp;
        this.isLiveTime = false;
      }
    });
  }

  // For debugging - show what these epochs represent in different timezones
  getDebugInfo(epochMillis: number) {
    return {
      epoch: epochMillis,
      swedishTime: this.dateService.epochToSwedishTime(epochMillis).toISO(),
      userTime: this.dateService.epochToUserTime(epochMillis).toISO(),
      userTimezone: this.dateService.getUserTimezone()
    };
  }

  // Update info when date picker value changes
  updateSelectedDateInfo(date: DateTime) {
    const epochForBackend = this.dateService.toBackendEpoch(date);
    this.selectedDateInfo = {
      selectedDate: date.toISO(),
      epochForBackend: epochForBackend,
      backAsSwedishTime: this.dateService.epochToSwedishTime(epochForBackend).toISO(),
      backAsUserTime: this.dateService.epochToUserTime(epochForBackend).toISO(),
      userTimezone: this.dateService.getUserTimezone()
    };
    
    // Update timezone display with selected timestamp
    this.currentTimestamp = epochForBackend;
    this.isLiveTime = false;
  }

  // Simulate sending to backend
  sendToBackend() {
    const date = this.dateControl.value;
    if (date) {
      const epoch = this.dateService.toBackendEpoch(date);
      alert(`Skickar till backend: ${epoch}\n(${date.toFormat('yyyy-MM-dd HH:mm')} som svensk tid)`);
    }
  }

  // Reset to current time
  showCurrentTime() {
    this.currentTimestamp = Date.now();
    this.isLiveTime = true;
    this.customTimestampControl.setValue(null);
    this.dateControl.setValue(null);
    this.selectedDateInfo = null;
  }

  // Set custom timestamp
  setCustomTimestamp() {
    const timestamp = this.customTimestampControl.value;
    if (timestamp && timestamp > 0) {
      this.currentTimestamp = timestamp;
      this.isLiveTime = false;
    }
  }

  // Get readable date from timestamp for display
  getReadableDate(timestamp: number): string {
    return DateTime.fromMillis(timestamp)
      .setZone(this.dateService.getUserTimezone())
      .toFormat('d MMM yyyy, HH:mm:ss');
  }

  // Helper method for template
  getYesterdayTimestamp(): number {
    return Date.now() - 86400000;
  }

  // Handle Swedish date picker selection
  onSwedishDateSelected(date: DateTime) {
    console.log('Swedish date selected:', date.toISO());
    // Here you could update other components or send to backend
  }
}
