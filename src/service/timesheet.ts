import { TimesheetResponse } from '@/models/timesheetResponse.interface';
import api from '@/utils/api';
import { AxiosResponse } from "axios";

export function getTimesheetResponse(week: number): Promise<AxiosResponse<TimesheetResponse>> {
    return api.get<TimesheetResponse>(`/timesheet?week=${week}`)
}