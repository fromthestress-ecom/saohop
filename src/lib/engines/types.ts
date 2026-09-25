export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface PersonInput {
  /** Họ tên đầy đủ (có dấu hoặc không). Không bắt buộc — chỉ cần cho các chỉ số theo tên. */
  fullName?: string;
  birthDate: SolarDate;
}

export function isValidSolarDate({ day, month, year }: SolarDate): boolean {
  if (![day, month, year].every(Number.isInteger)) return false;
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}
