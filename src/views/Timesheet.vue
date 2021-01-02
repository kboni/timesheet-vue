<template>
  <div>
    <h1>Timesheet</h1>
    <input type="date" @change="onDateSelect($event)" />
    <div v-if="selectedDate > new Date(0)">
      <p>Period: {{ selectedPeriod }}</p>
      <p>Week: {{ getWeek(selectedDate) }}</p>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox"  disabled /></th>
            <th>Project name</th>
            <th>Activity name</th>
            <th>Monday</th>
            <th>Tueday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th v-for="n in 7" :key="n">
              {{ formatDateToString(incrementDays(mondayInSelectedWeek, n - 1)) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timesheetRow, index) in timesheetRows" :key="index">
            <td>
              <input type="checkbox" :value="timesheetRow.id" v-model="checkedTimesheetRows" />
            </td>
            <td>
              <dropdown :options="allProjectNames" :initSelectedId="timesheetRow.projectId" v-model="timesheetRow.projectId" />
            </td>
            <td>
              <dropdown :options="allActivities" :initSelectedId="timesheetRow.activityId" v-model="timesheetRow.activityId" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.monday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.tuesday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.wednesday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.thursday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.friday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.saturday" />
            </td>
            <td>
              <weekday-text-input v-model="timesheetRow.hoursPerDay.sunday" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.MONDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.TUESDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.WEDNESDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.THURSDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.FRIDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.SATURDAY" />
            </td>
            <td>
              <total-hours :timesheetRows="timesheetRows" :day="dayEnum.SUNDAY" />
            </td>
          </tr>
        </tfoot>
      </table>
      <button @click="addRow">Add row</button>
      <button @click="ondDeleteSelectedTimesheetRows">Delete selected row(s)</button>
      <button @click="onSaveTimesheet">Save</button>
      <button @click="resetRows">Reset to last saved</button>
      <br />
      <button>Export week</button>
      <button>Export month</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  decrementDays,
  formatDateToString,
  getWeek,
  incrementDays,
} from "../utils/datetime";
import { deleteTimesheetRow, getActivity, getProject, getTimesheetResponse, insertTimesheetRow, updateTimesheet } from "../service/timesheet";
import {
  Activity,
  ActivityAndProject,
  Project,
  TimesheetResponse,
  TimesheetRow,
  HoursPerDay
} from "../models/timesheetResponse.interface";
import { AxiosResponse } from "axios";
import { defineComponent, InputHTMLAttributes } from "vue";
import Dropdown from "../components/Dropdown.vue";
import WeekdayTextInput from "../components/WeekdayTextInput.vue";
import TotalHours from "../components/TotalHours.vue";
import { Day } from "@/enums/day.enum";

export default defineComponent({
  name: "Timesheet",
  components: {
    Dropdown,
    WeekdayTextInput,
    TotalHours
  },
  data() {
    return {
      todayDate: new Date(new Date().setHours(0, 0, 0, 1)),
      selectedDate: new Date(0),
      selectedWeek: 0,
      mondayInSelectedWeek: new Date(0),
      timesheetRows: [] as TimesheetRow[],
      allActivities: [] as ActivityAndProject[],
      allProjectNames: [] as ActivityAndProject[],
      checkedTimesheetRows: [] as InputHTMLAttributes[],
      dayEnum: Day
    };
  },
  mounted() {
    this.getAllActivities();
    this.getAllProjects();
  },
  methods: {
    getAllActivities(): void {
      getActivity()
        .then((response: AxiosResponse<Activity>) => {
          this.allActivities = response.data.activity;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getAllProjects(): void {
      getProject()
        .then((response: AxiosResponse<Project>) => {
          this.allProjectNames = response.data.project;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    ondDeleteSelectedTimesheetRows(): void {
      let timesheetId: number;
      const deletePromises: Promise<AxiosResponse<TimesheetResponse>>[] = [];

      this.checkedTimesheetRows.forEach((checkbox: InputHTMLAttributes) => {
        timesheetId = Number(checkbox.value);
        deletePromises.push(deleteTimesheetRow(timesheetId));
      });
      Promise.all(deletePromises)
      .then(() => {
        this.getTimesheetRows(this.selectedWeek);
        this.checkedTimesheetRows = [];
      })
    },
    onSaveTimesheet(): void {
      updateTimesheet(this.timesheetRows)
      .then(() => {
        console.log('Success update');
      })
      .catch((err) => {
          console.error(err);
        });
    },
    onDateSelect(event: any): void {
      this.selectedDate = new Date(event.target.value);
      this.selectedWeek = getWeek(this.selectedDate);
      this.getTimesheetRows(this.selectedWeek);

      const selectedDayOfTheWeek = this.selectedDate.getDay();
      const numberOfDaysToPreviousMonday =
        selectedDayOfTheWeek === 0 ? 7 : selectedDayOfTheWeek;

      this.mondayInSelectedWeek = decrementDays(
        this.selectedDate,
        numberOfDaysToPreviousMonday - 1
      );
    },
    formatDateToString: formatDateToString,
    getWeek: getWeek,
    incrementDays: incrementDays,
    getTimesheetRows(week: number) {
      getTimesheetResponse(week)
        .then((response: AxiosResponse<TimesheetResponse>) => {
          this.timesheetRows = response.data.timesheetRows;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addRow() {
      const selectedWeek = this.selectedWeek;
      insertTimesheetRow(selectedWeek)
        .then(() => {
          this.getTimesheetRows(selectedWeek);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetRows() {
      this.getTimesheetRows(this.selectedWeek);
      this.getAllActivities();
      this.getAllProjects();
    },
  },
  computed: {
    selectedPeriod(): string {
      const sundayInSelectedWeek = incrementDays(this.mondayInSelectedWeek, 6);

      return (
        formatDateToString(this.mondayInSelectedWeek) +
        " - " +
        formatDateToString(sundayInSelectedWeek)
      );
    },
  },
});
</script>
