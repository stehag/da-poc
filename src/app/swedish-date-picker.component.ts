import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from './luxon-date-adapter';

const SWEDISH_DATE_FORMATS = {
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
  selector: 'app-swedish-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
    { provide: MAT_DATE_FORMATS, useValue: SWEDISH_DATE_FORMATS }
  ],
  template: `
    <div class="swedish-date-picker">
      <div class="picker-header" *ngIf="showTimezoneWarning">
        <div class="timezone-warning">
          <mat-icon class="warning-icon">info</mat-icon>
          <div class="warning-content">
            <strong>Viktigt:</strong> Du väljer datum enligt <strong>svensk tid</strong>.
            <br>
            <span class="user-timezone-info">
              Din aktuella tidszon: {{ userTimezone }}
            </span>
          </div>
        </div>
      </div>

      <mat-form-field appearance="outline" class="date-field">
        <mat-label>{{ label }}</mat-label>
        <input matInput 
               [matDatepicker]="picker" 
               [formControl]="dateControl"
               [placeholder]="placeholder">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-hint *ngIf="showTimezoneWarning">
          Datum i svensk tid (Europe/Stockholm)
        </mat-hint>
      </mat-form-field>

      <div class="date-preview" *ngIf="dateControl.value && showTimezoneWarning">
        <div class="preview-content">
          <div class="swedish-date">
            <strong>Valt datum (svensk tid):</strong>
            {{ getSwedishDateDisplay() }}
          </div>
          <div class="user-date" *ngIf="userTimezone !== 'Europe/Stockholm'">
            <strong>I din tidszon ({{ userTimezone }}):</strong>
            {{ getUserDateDisplay() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .swedish-date-picker {
      width: 100%;
      max-width: 400px;
    }

    .picker-header {
      margin-bottom: 1rem;
    }

    .timezone-warning {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #fff3e0;
      border: 1px solid #ffcc02;
      border-radius: 8px;
      padding: 1rem;
    }

    .warning-icon {
      color: #f57c00;
      margin-top: 0.1rem;
      flex-shrink: 0;
    }

    .warning-content {
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .user-timezone-info {
      color: #6c757d;
      font-size: 0.85rem;
    }

    .date-field {
      width: 100%;
    }

    .date-preview {
      margin-top: 1rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 1rem;
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .swedish-date {
      color: #1976d2;
      font-size: 0.9rem;
    }

    .user-date {
      color: #28a745;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .timezone-warning {
        padding: 0.75rem;
        gap: 0.5rem;
      }
      
      .warning-content {
        font-size: 0.85rem;
      }
    }
  `]
})
export class SwedishDatePickerComponent implements OnInit {
  @Input() label: string = 'Välj datum';
  @Input() placeholder: string = 'yyyy-mm-dd';
  @Input() value: DateTime | null = null;
  @Output() dateSelected = new EventEmitter<DateTime>();

  dateControl = new FormControl<DateTime | null>(null);
  userTimezone: string = '';
  showTimezoneWarning: boolean = false;

  ngOnInit() {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.showTimezoneWarning = this.userTimezone !== 'Europe/Stockholm';
    
    if (this.value) {
      this.dateControl.setValue(this.value);
    }

    this.dateControl.valueChanges.subscribe(date => {
      if (date) {
        this.dateSelected.emit(date);
      }
    });
  }

  getSwedishDateDisplay(): string {
    const date = this.dateControl.value;
    if (!date) return '';
    
    return date.toFormat('d MMMM yyyy', { locale: 'sv-SE' });
  }

  getUserDateDisplay(): string {
    const date = this.dateControl.value;
    if (!date) return '';
    
    // Convert Swedish date to user's timezone at the same wall clock time
    const userDate = date.setZone(this.userTimezone, { keepLocalTime: true });
    return userDate.toFormat('d MMMM yyyy, HH:mm');
  }
}