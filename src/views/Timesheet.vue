<template>
  <div class="home">
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
              <input type="checkbox" name="" id="">
            </td>
            <td>
              <select>
                <option>{{ timesheetRow.project }}</option>
              </select>
            </td>
            <td>
              <select>
                <option>{{ timesheetRow.activity }}</option>
              </select>
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
      <button>Add row</button>
      <button>Delete selected row(s)</button>
      <button>Save</button>
      <button>Reset to last saved</button>
    </div>
  </div>
</template>

<script lang="ts">
import { decrementDays, formatDateToString, getWeek, incrementDays } from "../utils/datetime";
import { defineComponent } from "vue";
import { getTimesheetResponse } from "../service/timesheet";
import { TimesheetResponse, TimesheetRows } from "../models/timesheetResponse.interface";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "Timesheet",
  data() {
    return {
      todayDate: new Date(new Date().setHours(0, 0, 0, 1)),
      selectedDate: new Date(0),
      mondayInSelectedWeek: new Date(0),
      timesheetRows: [] as TimesheetRows[]
    };
  },
  methods: {
    onDateSelect(event: any): void {
      this.selectedDate = new Date(event.target.value);

      this.getTimesheetRows(getWeek(this.selectedDate));

      const selectedDayOfTheWeek =  this.selectedDate.getDay();
      const numberOfDaysToPreviousMonday = selectedDayOfTheWeek === 0 ? 7 : selectedDayOfTheWeek;

      this.mondayInSelectedWeek = decrementDays(this.selectedDate, numberOfDaysToPreviousMonday - 1);
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
        console.log(err)
      })
    }
  },
  computed: {
    selectedPeriod(): string {
      const sundayInSelectedWeek = incrementDays(this.mondayInSelectedWeek, 6);

      return formatDateToString(this.mondayInSelectedWeek) + ' - ' + formatDateToString(sundayInSelectedWeek);
    }
  }
})
</script>
