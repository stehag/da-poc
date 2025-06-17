import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateTime } from 'luxon';

@Injectable()
export class LuxonDateAdapter extends DateAdapter<DateTime> {
  private readonly SWEDEN_ZONE = 'Europe/Stockholm';

  getYear(date: DateTime): number {
    return date.year;
  }

  getMonth(date: DateTime): number {
    return date.month - 1; // Material uses 0-based months
  }

  getDate(date: DateTime): number {
    return date.day;
  }

  getDayOfWeek(date: DateTime): number {
    return date.weekday % 7; // Material expects Sunday = 0
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const format = style === 'long' ? 'LLLL' : style === 'short' ? 'LLL' : 'LLLLL';
    return Array.from({ length: 12 }, (_, i) =>
      DateTime.local(2024, i + 1, 1).setLocale('sv-SE').toFormat(format)
    );
  }

  getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const format = style === 'long' ? 'cccc' : style === 'short' ? 'ccc' : 'ccccc';
    return Array.from({ length: 7 }, (_, i) =>
      DateTime.local(2024, 1, 1 + i).setLocale('sv-SE').toFormat(format)
    );
  }

  getYearName(date: DateTime): string {
    return date.year.toString();
  }

  getFirstDayOfWeek(): number {
    return 1; // Monday for Swedish locale
  }

  getNumDaysInMonth(date: DateTime): number {
    return date.daysInMonth || 0;
  }

  clone(date: DateTime): DateTime {
    return date;
  }

  createDate(year: number, month: number, date: number): DateTime {
    // Create date in Swedish timezone to match backend expectations
    return DateTime.local(year, month + 1, date, { zone: this.SWEDEN_ZONE });
  }

  today(): DateTime {
    return DateTime.now().setZone(this.SWEDEN_ZONE);
  }

  parse(value: any, parseFormat?: any): DateTime | null {
    if (typeof value === 'string' && value) {
      const parsed = DateTime.fromISO(value, { zone: this.SWEDEN_ZONE });
      return parsed.isValid ? parsed : null;
    }
    return null;
  }

  format(date: DateTime, displayFormat: any): string {
    return date.setLocale('sv-SE').toFormat(displayFormat || 'yyyy-MM-dd');
  }

  addCalendarYears(date: DateTime, years: number): DateTime {
    return date.plus({ years });
  }

  addCalendarMonths(date: DateTime, months: number): DateTime {
    return date.plus({ months });
  }

  addCalendarDays(date: DateTime, days: number): DateTime {
    return date.plus({ days });
  }

  toIso8601(date: DateTime): string {
    return date.toISO() || '';
  }

  fromIso8601(iso8601String: string): DateTime | null {
    const parsed = DateTime.fromISO(iso8601String, { zone: this.SWEDEN_ZONE });
    return parsed.isValid ? parsed : null;
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof DateTime;
  }

  isValid(date: DateTime): boolean {
    return date.isValid;
  }

  invalid(): DateTime {
    return DateTime.invalid('Invalid date');
  }

  override deserialize(value: any): DateTime | null {
    if (value) {
      if (typeof value === 'string') {
        return this.parse(value);
      }
      if (typeof value === 'number') {
        return DateTime.fromMillis(value, { zone: this.SWEDEN_ZONE });
      }
      if (value instanceof DateTime) {
        return value.setZone(this.SWEDEN_ZONE);
      }
    }
    return null;
  }
}