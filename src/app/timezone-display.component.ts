import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

interface TimezoneInfo {
  name: string;
  zone: string;
  city: string;
  country: string;
  isSwedish?: boolean;
}

@Component({
  selector: 'app-timezone-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timezone-grid">
      @for (timezone of timezones; track timezone.zone) {
        <div class="timezone-card" [class.swedish-timezone]="timezone.isSwedish">
          <div class="timezone-header">
            <h4>{{ timezone.city }}</h4>
            <span class="country">{{ timezone.country }}</span>
          </div>
          <div class="timezone-time">
            {{ getTimeInTimezone(timezone.zone) }}
          </div>
          <div class="timezone-date">
            {{ getDateInTimezone(timezone.zone) }}
          </div>
          <div class="timezone-name">
            {{ timezone.name }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timezone-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .timezone-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .timezone-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .swedish-timezone {
      background: #e3f2fd !important;
      border: 2px solid #2196f3 !important;
      box-shadow: 0 2px 8px rgba(33,150,243,0.3);
    }

    .swedish-timezone:hover {
      box-shadow: 0 4px 16px rgba(33,150,243,0.4);
    }

    .timezone-header h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .country {
      font-size: 0.8rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .timezone-time {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0.5rem 0;
    }

    .swedish-timezone .timezone-time {
      color: #1976d2;
    }

    .timezone-date {
      font-size: 0.9rem;
      color: #495057;
      margin: 0.25rem 0;
    }

    .timezone-name {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.5rem;
      font-family: monospace;
    }

    @media (max-width: 768px) {
      .timezone-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.5rem;
      }
      
      .timezone-card {
        padding: 0.75rem;
      }
      
      .timezone-time {
        font-size: 1.2rem;
      }
    }
  `]
})
export class TimezoneDisplayComponent implements OnChanges {
  @Input() timestamp: number = Date.now();

  timezones: TimezoneInfo[] = [
    { name: 'UTC-12', zone: 'Pacific/Kwajalein', city: 'Kwajalein', country: 'Marshall Islands' },
    { name: 'UTC-11', zone: 'Pacific/Samoa', city: 'Samoa', country: 'American Samoa' },
    { name: 'UTC-10', zone: 'Pacific/Honolulu', city: 'Honolulu', country: 'USA' },
    { name: 'UTC-9', zone: 'America/Anchorage', city: 'Anchorage', country: 'USA' },
    { name: 'UTC-8', zone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA' },
    { name: 'UTC-7', zone: 'America/Denver', city: 'Denver', country: 'USA' },
    { name: 'UTC-6', zone: 'America/Chicago', city: 'Chicago', country: 'USA' },
    { name: 'UTC-5', zone: 'America/New_York', city: 'New York', country: 'USA' },
    { name: 'UTC-4', zone: 'America/Caracas', city: 'Caracas', country: 'Venezuela' },
    { name: 'UTC-3', zone: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil' },
    { name: 'UTC-2', zone: 'Atlantic/South_Georgia', city: 'South Georgia', country: 'UK' },
    { name: 'UTC-1', zone: 'Atlantic/Azores', city: 'Azores', country: 'Portugal' },
    { name: 'UTC+0', zone: 'Europe/London', city: 'London', country: 'UK' },
    { name: 'UTC+1', zone: 'Europe/Stockholm', city: 'Stockholm', country: 'Sverige', isSwedish: true },
    { name: 'UTC+2', zone: 'Europe/Helsinki', city: 'Helsinki', country: 'Finland' },
    { name: 'UTC+3', zone: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
    { name: 'UTC+4', zone: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
    { name: 'UTC+5', zone: 'Asia/Karachi', city: 'Karachi', country: 'Pakistan' },
    { name: 'UTC+6', zone: 'Asia/Dhaka', city: 'Dhaka', country: 'Bangladesh' },
    { name: 'UTC+7', zone: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand' },
    { name: 'UTC+8', zone: 'Asia/Shanghai', city: 'Shanghai', country: 'China' },
    { name: 'UTC+9', zone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
    { name: 'UTC+10', zone: 'Australia/Sydney', city: 'Sydney', country: 'Australia' },
    { name: 'UTC+11', zone: 'Pacific/Noumea', city: 'Nouméa', country: 'New Caledonia' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timestamp']) {
      // Component will re-render when timestamp changes
    }
  }

  getTimeInTimezone(timezone: string): string {
    return DateTime.fromMillis(this.timestamp)
      .setZone(timezone)
      .toFormat('HH:mm:ss');
  }

  getDateInTimezone(timezone: string): string {
    return DateTime.fromMillis(this.timestamp)
      .setZone(timezone)
      .toFormat('yyyy-MM-dd');
  }
}