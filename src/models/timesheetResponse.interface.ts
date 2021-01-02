export interface TimesheetResponse {
    timesheetRows: TimesheetRow[]
}

export interface TimesheetRow {
    id: number,
    projectId: number,
    activityId: number,
    hoursPerDay: HoursPerDay
}

export interface HoursPerDay {
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string,
    saturday: string,
    sunday: string
}

export interface Activity {
    activity: ActivityAndProject[]
}

export interface Project {
    project: ActivityAndProject[]
}

export interface ActivityAndProject {
    id: number,
    name: string
}