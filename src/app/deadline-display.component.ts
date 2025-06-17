import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

interface DeadlineInfo {
  zone: string;
  city: string;
  country: string;
  localDeadline: DateTime;
  timeUntilDeadline: string;
  isPast: boolean;
  isSwedish?: boolean;
}

@Component({
  selector: 'app-deadline-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="deadline-container">
      <div class="deadline-header">
        <h3>Deadline: {{ swedishDeadline?.toFormat('d MMM yyyy, HH:mm') }} (svensk tid)</h3>
        <p class="timestamp-info">Timestamp: {{ getSwedishTimestamp() }}</p>
        <p>Så här ser deadlinen ut i olika tidszoner:</p>
      </div>
      
      <div class="deadline-grid">
        @for (deadline of deadlineInfos; track deadline.zone) {
          <div class="deadline-card" 
               [class.swedish-deadline]="deadline.isSwedish"
               [class.past-deadline]="deadline.isPast">
            <div class="deadline-location">
              <h4>{{ deadline.city }}</h4>
              <span class="country">{{ deadline.country }}</span>
            </div>
            <div class="deadline-time">
              {{ deadline.localDeadline.toFormat('d MMM, HH:mm') }}
            </div>
            <div class="deadline-countdown" [class.overdue]="deadline.isPast">
              {{ deadline.timeUntilDeadline }}
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .deadline-container {
      background: #fff8e1;
      border: 1px solid #ffcc02;
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem 0;
    }

    .deadline-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .deadline-header h3 {
      color: #f57c00;
      margin-bottom: 0.5rem;
      font-size: 1.3rem;
    }

    .deadline-header p {
      color: #6c757d;
      margin: 0;
    }

    .timestamp-info {
      font-family: monospace;
      font-size: 0.9rem;
      color: #495057 !important;
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0 !important;
    }

    .deadline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .deadline-card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .deadline-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .swedish-deadline {
      background: #e3f2fd !important;
      border: 2px solid #f57c00 !important;
      box-shadow: 0 2px 8px rgba(245,124,0,0.3);
    }

    .past-deadline {
      background: #ffebee !important;
      border-color: #f44336 !important;
    }

    .deadline-location h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }

    .country {
      font-size: 0.75rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .deadline-time {
      font-size: 1.1rem;
      font-weight: bold;
      color: #f57c00;
      margin: 0.5rem 0;
    }

    .swedish-deadline .deadline-time {
      color: #1976d2;
    }

    .past-deadline .deadline-time {
      color: #f44336;
    }

    .deadline-countdown {
      font-size: 0.85rem;
      color: #495057;
      margin-top: 0.5rem;
      font-weight: 500;
    }

    .overdue {
      color: #f44336 !important;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .deadline-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.75rem;
      }
      
      .deadline-card {
        padding: 0.75rem;
      }
    }
  `]
})
export class DeadlineDisplayComponent implements OnChanges {
  @Input() deadlineDate: string = '2025-06-18'; // Swedish date
  @Input() deadlineTime: string = '23:59'; // Swedish time

  swedishDeadline: DateTime | null = null;
  deadlineInfos: DeadlineInfo[] = [];

  private timezones = [
    { zone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA' },
    { zone: 'America/New_York', city: 'New York', country: 'USA' },
    { zone: 'Europe/London', city: 'London', country: 'UK' },
    { zone: 'Europe/Stockholm', city: 'Stockholm', country: 'Sverige', isSwedish: true },
    { zone: 'Europe/Helsinki', city: 'Helsinki', country: 'Finland' },
    { zone: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
    { zone: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
    { zone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
    { zone: 'Australia/Sydney', city: 'Sydney', country: 'Australia' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    this.updateDeadlineInfo();
  }

  private updateDeadlineInfo() {
    // Create deadline in Swedish timezone
    const deadlineString = `${this.deadlineDate}T${this.deadlineTime}:00`;
    this.swedishDeadline = DateTime.fromISO(deadlineString, { zone: 'Europe/Stockholm' });

    if (!this.swedishDeadline.isValid) {
      return;
    }

    const now = DateTime.now();
    
    this.deadlineInfos = this.timezones.map(tz => {
      const localDeadline = this.swedishDeadline!.setZone(tz.zone);
      const localNow = now.setZone(tz.zone);
      const isPast = localDeadline < localNow;
      
      let timeUntilDeadline: string;
      if (isPast) {
        const diff = localNow.diff(localDeadline, ['days', 'hours', 'minutes']);
        if (diff.days > 0) {
          timeUntilDeadline = `${Math.floor(diff.days)}d ${Math.floor(diff.hours)}h sedan`;
        } else if (diff.hours > 0) {
          timeUntilDeadline = `${Math.floor(diff.hours)}h ${Math.floor(diff.minutes)}m sedan`;
        } else {
          timeUntilDeadline = `${Math.floor(diff.minutes)}m sedan`;
        }
      } else {
        const diff = localDeadline.diff(localNow, ['days', 'hours', 'minutes']);
        if (diff.days > 0) {
          timeUntilDeadline = `${Math.floor(diff.days)}d ${Math.floor(diff.hours)}h kvar`;
        } else if (diff.hours > 0) {
          timeUntilDeadline = `${Math.floor(diff.hours)}h ${Math.floor(diff.minutes)}m kvar`;
        } else {
          timeUntilDeadline = `${Math.floor(diff.minutes)}m kvar`;
        }
      }

      return {
        zone: tz.zone,
        city: tz.city,
        country: tz.country,
        localDeadline,
        timeUntilDeadline,
        isPast,
        isSwedish: tz.isSwedish
      };
    });
  }

  getSwedishTimestamp(): number {
    return this.swedishDeadline?.toMillis() || 0;
  }
}