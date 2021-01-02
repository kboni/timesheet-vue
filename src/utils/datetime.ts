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

// export function sumTime(time1: string, time2: string): string {
//     const time1Parts = time1.split(':');
//     const time2Parts = time2.split(':');

//     const time1Hours = Number(time1Parts[0])
//     const time2Hours = Number(time2Parts[0])

//     const time1Minutes = Number(time1Parts[1])
//     const time2Minutes = Number(time2Parts[1])

//     const time1ToSeconds = (time1Minutes * 60) + (time1Hours * 60 * 60);
//     const time2ToSeconds = (time2Minutes * 60) + (time2Hours * 60 * 60);

//     let timeSumInSeconds = time1ToSeconds + time2ToSeconds
//     const timeSumHours = Math.floor(timeSumInSeconds / 3600);
//     timeSumInSeconds %= 3600;
//     const timeSumMinutes = Math.floor(timeSumInSeconds / 60);

//     return `${timeSumHours}:${timeSumMinutes}`
// }

export function timeStringtoSeconds(time: string): number {
    const timeParts = time.split(':');

    const timeHours = Number(timeParts[0])

    const timeMinutes = Number(timeParts[1])

    return (timeMinutes * 60) + (timeHours * 60 * 60);
}

export function secondsToTimeString(seconds: number): string {
    const timeSumHours = Math.floor(seconds / 3600);
    const timeSumHoursString = timeSumHours < 10 ? `0${timeSumHours}` : `${timeSumHours}`

    seconds %= 3600;
    const timeSumMinutes = Math.floor(seconds / 60);
    const timeSumMinutesString = timeSumMinutes < 10 ? `0${timeSumMinutes}` : `${timeSumMinutes}`

    return `${timeSumHoursString}:${timeSumMinutesString}`
}