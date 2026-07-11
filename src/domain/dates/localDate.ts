export type LocalDateString = string;

export function toLocalDate(date = new Date()): LocalDateString {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: LocalDateString, days: number): LocalDateString {
  const d = parseLocalDate(date);
  d.setDate(d.getDate() + days);
  return toLocalDate(d);
}

export function parseLocalDate(date: LocalDateString): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function compareLocalDates(a: LocalDateString, b: LocalDateString): number {
  return parseLocalDate(a).getTime() - parseLocalDate(b).getTime();
}

export function daysBetween(a: LocalDateString, b: LocalDateString): number {
  return Math.round((parseLocalDate(b).getTime() - parseLocalDate(a).getTime()) / 86_400_000);
}

export function startOfWeek(date: LocalDateString): LocalDateString {
  const d = parseLocalDate(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return toLocalDate(d);
}
