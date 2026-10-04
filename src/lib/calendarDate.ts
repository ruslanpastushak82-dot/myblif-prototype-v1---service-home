export const toLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const startOfWeekMonday = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = result.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  result.setDate(result.getDate() + offset);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
};

export const formatMonthTitle = (date: Date): string =>
  date.toLocaleDateString("en-CA", { month: "long", year: "numeric" });

export const formatDayTitle = (date: Date): string =>
  date.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const formatWeekTitle = (start: Date): string => {
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.toLocaleDateString("en-CA", { month: "short" })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}–${end.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}, ${end.getFullYear()}`;
};

export const buildMondayFirstMonthGrid = (date: Date): Array<number | null> => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const leading = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};
