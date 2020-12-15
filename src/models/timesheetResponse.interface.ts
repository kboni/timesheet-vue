export interface TimesheetResponse {
    timesheetRows: TimesheetRow[]
}

export interface TimesheetRow {
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