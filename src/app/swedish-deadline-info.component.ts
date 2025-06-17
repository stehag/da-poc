import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-swedish-deadline-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="deadline-info" [class.urgent]="isUrgent" [class.past]="isPastDeadline">
      <div class="deadline-header">
        <mat-icon class="deadline-icon">
          {{ isPastDeadline ? 'error' : isUrgent ? 'warning' : 'schedule' }}
        </mat-icon>
        <h3>{{ title }}</h3>
      </div>

      <div class="deadline-content">
        <div class="swedish-deadline">
          <strong>Sista datum (svensk tid):</strong>
          <div class="date-display">
            {{ getSwedishDateDisplay() }}
          </div>
        </div>

        <div class="user-deadline" *ngIf="showUserTimezone">
          <strong>I din tidszon ({{ userTimezone }}):</strong>
          <div class="date-display user-date">
            {{ getUserDateDisplay() }}
          </div>
          <div class="timezone-explanation">
            <mat-icon class="info-icon">info</mat-icon>
            <span>
              Detta är deadline uttryckt i din lokala tid. 
              Det officiella datumet gäller dock i svensk tid.
            </span>
          </div>
        </div>

        <div class="countdown" *ngIf="!isPastDeadline">
          <div class="countdown-label">Tid kvar:</div>
          <div class="countdown-value">{{ getTimeRemaining() }}</div>
        </div>

        <div class="overdue" *ngIf="isPastDeadline">
          <div class="overdue-label">Deadline har passerat:</div>
          <div class="overdue-value">{{ getTimePassed() }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .deadline-info {
      background: #f8f9fa;
      border: 2px solid #28a745;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
      transition: all 0.3s ease;
    }

    .deadline-info.urgent {
      background: #fff8e1;
      border-color: #ff9800;
    }

    .deadline-info.past {
      background: #ffebee;
      border-color: #f44336;
    }

    .deadline-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .deadline-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: #28a745;
    }

    .urgent .deadline-icon {
      color: #ff9800;
    }

    .past .deadline-icon {
      color: #f44336;
    }

    .deadline-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .deadline-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .swedish-deadline,
    .user-deadline {
      padding: 1rem;
      border-radius: 8px;
    }

    .swedish-deadline {
      background: #e3f2fd;
      border: 1px solid #2196f3;
    }

    .user-deadline {
      background: #e8f5e8;
      border: 1px solid #4caf50;
    }

    .date-display {
      font-size: 1.3rem;
      font-weight: bold;
      margin-top: 0.5rem;
      color: #1976d2;
    }

    .user-date {
      color: #388e3c;
    }

    .timezone-explanation {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.85rem;
      color: #6c757d;
      line-height: 1.4;
    }

    .info-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      margin-top: 0.1rem;
      flex-shrink: 0;
    }

    .countdown,
    .overdue {
      text-align: center;
      padding: 1rem;
      border-radius: 8px;
    }

    .countdown {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .overdue {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .countdown-label,
    .overdue-label {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .countdown-value,
    .overdue-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .deadline-info {
        padding: 1rem;
      }
      
      .deadline-header {
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .deadline-content {
        gap: 1rem;
      }
      
      .date-display {
        font-size: 1.1rem;
      }
      
      .countdown-value,
      .overdue-value {
        font-size: 1.3rem;
      }
    }
  `]
})
export class SwedishDeadlineInfoComponent implements OnInit, OnChanges {
  @Input() title: string = 'Sista inlämningsdatum';
  @Input() deadlineDate: string = ''; // Format: '2025-06-18'
  @Input() deadlineTime: string = '23:59'; // Format: '23:59'

  userTimezone: string = '';
  showUserTimezone: boolean = false;
  swedishDeadline: DateTime | null = null;
  userDeadline: DateTime | null = null;
  isPastDeadline: boolean = false;
  isUrgent: boolean = false;

  ngOnInit() {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.showUserTimezone = this.userTimezone !== 'Europe/Stockholm';
    this.updateDeadlineInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['deadlineDate'] || changes['deadlineTime']) {
      this.updateDeadlineInfo();
    }
  }

  private updateDeadlineInfo() {
    if (!this.deadlineDate) return;

    // Create deadline in Swedish timezone
    const deadlineString = `${this.deadlineDate}T${this.deadlineTime}:00`;
    this.swedishDeadline = DateTime.fromISO(deadlineString, { zone: 'Europe/Stockholm' });

    if (!this.swedishDeadline.isValid) return;

    // Convert to user's timezone
    this.userDeadline = this.swedishDeadline.setZone(this.userTimezone);

    // Check if deadline has passed
    const now = DateTime.now().setZone('Europe/Stockholm');
    this.isPastDeadline = this.swedishDeadline < now;

    // Check if urgent (less than 24 hours remaining)
    if (!this.isPastDeadline) {
      const hoursRemaining = this.swedishDeadline.diff(now, 'hours').hours;
      this.isUrgent = hoursRemaining <= 24;
    }
  }

  getSwedishDateDisplay(): string {
    if (!this.swedishDeadline) return '';
    return this.swedishDeadline.setLocale('sv-SE').toFormat('d MMMM yyyy, HH:mm');
  }

  getUserDateDisplay(): string {
    if (!this.userDeadline) return '';
    return this.userDeadline.toFormat('d MMMM yyyy, HH:mm:ss');
  }

  getTimeRemaining(): string {
    if (!this.swedishDeadline || this.isPastDeadline) return '';

    const now = DateTime.now().setZone('Europe/Stockholm');
    const diff = this.swedishDeadline.diff(now, ['days', 'hours', 'minutes']);

    if (diff.days > 0) {
      return `${Math.floor(diff.days)} dagar, ${Math.floor(diff.hours)} timmar`;
    } else if (diff.hours > 0) {
      return `${Math.floor(diff.hours)} timmar, ${Math.floor(diff.minutes)} minuter`;
    } else {
      return `${Math.floor(diff.minutes)} minuter`;
    }
  }

  getTimePassed(): string {
    if (!this.swedishDeadline || !this.isPastDeadline) return '';

    const now = DateTime.now().setZone('Europe/Stockholm');
    const diff = now.diff(this.swedishDeadline, ['days', 'hours', 'minutes']);

    if (diff.days > 0) {
      return `${Math.floor(diff.days)} dagar, ${Math.floor(diff.hours)} timmar sedan`;
    } else if (diff.hours > 0) {
      return `${Math.floor(diff.hours)} timmar, ${Math.floor(diff.minutes)} minuter sedan`;
    } else {
      return `${Math.floor(diff.minutes)} minuter sedan`;
    }
  }
}