import { formatInTimeZone } from 'date-fns-tz';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const TIMEZONE = 'America/Denver';

export function getWeekStart(date: Date): Date {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  return weekStart;
}

export function getWeekEnd(date: Date): Date {
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Monday
  return weekEnd;
}

export function getMonthStart(date: Date): Date {
  const monthStart = startOfMonth(date);
  return monthStart;
}

export function getMonthEnd(date: Date): Date {
  const monthEnd = endOfMonth(date);
  return monthEnd;
}

export function getWeekLabel(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export function getMonthLabel(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, '0')}`;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}
