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
            <th><input type="checkbox" name="" id="" disabled /></th>
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
              <Dropdown :data="allProjectNames" :selectedId="timesheetRow.projectId" />
            </td>
            <td>
              <Dropdown :data="allActivities" :selectedId="timesheetRow.activityId" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.monday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.tuesday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.wednesday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.thursday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.friday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.saturday" />
            </td>
            <td>
              <input type="text" :value="timesheetRow.hoursPerDay.sunday" />
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="addRow">Add row</button>
      <button @click="ondDeleteSelectedTimesheetRows">Delete selected row(s)</button>
      <button>Save</button>
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
import { deleteTimesheetRow, getActivity, getProject, getTimesheetResponse } from "../service/timesheet";
import {
  Activity,
  ActivityAndProject,
  Project,
  TimesheetResponse,
  TimesheetRow,
} from "../models/timesheetResponse.interface";
import { AxiosResponse } from "axios";
import { defineComponent, InputHTMLAttributes } from "vue";
import Dropdown from "../components/Dropdown.vue";

export default defineComponent({
  name: "Timesheet",
  components: {
    Dropdown,
  },
  data() {
    return {
      todayDate: new Date(new Date().setHours(0, 0, 0, 1)),
      selectedDate: new Date(0),
      mondayInSelectedWeek: new Date(0),
      timesheetRows: [] as TimesheetRow[],
      originalTimesheetRows: [] as TimesheetRow[],
      allActivities: [] as ActivityAndProject[],
      allProjectNames: [] as ActivityAndProject[],
      checkedTimesheetRows: [] as InputHTMLAttributes[]
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
      console.log(this.checkedTimesheetRows)
      let timesheetId: number;
      const deletePromises: Promise<AxiosResponse<TimesheetResponse>>[] = [];

      this.checkedTimesheetRows.forEach((checkbox: InputHTMLAttributes) => {
        timesheetId = Number(checkbox.value);
        deletePromises.push(deleteTimesheetRow(timesheetId));
      });
      Promise.all(deletePromises)
      .then(() => {
        this.getTimesheetRows(getWeek(this.selectedDate));
        this.checkedTimesheetRows = [];
      })
    },
    onDateSelect(event: any): void {
      this.selectedDate = new Date(event.target.value);

      this.getTimesheetRows(getWeek(this.selectedDate));

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
          this.originalTimesheetRows = JSON.parse(JSON.stringify(this.timesheetRows));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addRow() {
      this.timesheetRows.push({
        id: 0,
        projectId: 0,
        activityId: 0,
        hoursPerDay: [],
      } as TimesheetRow);
    },
    resetRows() {
      this.timesheetRows = JSON.parse(JSON.stringify(this.originalTimesheetRows));
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
