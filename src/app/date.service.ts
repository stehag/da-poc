import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly SWEDEN_ZONE = 'Europe/Stockholm';

  /**
   * Converts epoch milliseconds (from backend) to DateTime in user's timezone
   * Backend stores data as Swedish time, but sends epoch millis
   */
  fromBackendEpoch(epochMillis: number): DateTime {
    // Epoch is always UTC, but backend created it from Swedish time
    return DateTime.fromMillis(epochMillis)
      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  /**
   * Converts user input to epoch milliseconds for backend
   * User input should be interpreted as Swedish time
   */
  toBackendEpoch(userDateTime: DateTime): number {
    return userDateTime
      .setZone(this.SWEDEN_ZONE, { keepLocalTime: true })
      .toMillis();
  }

  /**
   * For debugging: Shows what the epoch represents in Swedish timezone
   */
  epochToSwedishTime(epochMillis: number): DateTime {
    return DateTime.fromMillis(epochMillis).setZone(this.SWEDEN_ZONE);
  }

  /**
   * For debugging: Shows what the epoch represents in user's timezone
   */
  epochToUserTime(epochMillis: number): DateTime {
    return DateTime.fromMillis(epochMillis)
      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  /**
   * Gets user's current timezone
   */
  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}