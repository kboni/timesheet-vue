export interface TimesheetResponse {
    timesheetRows: TimesheetRows[]
}

export interface TimesheetRows {
    project: string,
    activity: string,
    hoursPerDay: HoursPerDay[]
}

interface HoursPerDay {
    monday?: string,
    tuesday?: string,
    wednesday?: string,
    thursday?: string,
    friday?: string,
    saturday?: string,
    sunday?: string
}