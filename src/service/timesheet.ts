import { Activity, Project, TimesheetResponse } from '@/models/timesheetResponse.interface';
import api from '@/utils/api';
import { AxiosResponse } from "axios";

export function getTimesheetResponse(week: number): Promise<AxiosResponse<TimesheetResponse>> {
    return api.get<TimesheetResponse>(`/timesheet?week=${week}`);
}

export function getActivity(id?: number): Promise<AxiosResponse<Activity>> {
    return api.get<Activity>('/timesheet/activity' + (id ? `?id=${id}` : ''));
}

export function getProject(id?: number): Promise<AxiosResponse<Project>> {
    return api.get<Project>('/timesheet/project' + (id ? `?id=${id}` : ''));
}