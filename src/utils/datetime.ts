export function formatDateToString(inputDate: Date): string {
    return inputDate.toISOString().slice(0, 10);
}

export function getWeek(date: Date) {
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }

export function incrementDays(currentDate: Date, incrementBy: number): Date {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + incrementBy);
    return newDate;
}

export function decrementDays(currentDate: Date, decrementBy: number): Date {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - decrementBy);
    return newDate;
}