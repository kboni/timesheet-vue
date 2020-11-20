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
          <table-row />
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
import TableRow from "@/components/timesheet/TableRow.vue"; // @ is an alias to /src
import { decrementDays, formatDateToString, getWeek, incrementDays } from "../utils/datetime";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Timesheet",
  components: {
    TableRow
  },
  data() {
    return {
      todayDate: new Date(new Date().setHours(0, 0, 0, 1)),
      selectedDate: new Date(0),
      mondayInSelectedWeek: new Date(0)
    };
  },
  methods: {
    onDateSelect(event: any): void {
      this.selectedDate = new Date(event.target.value);

      const selectedDayOfTheWeek =  this.selectedDate.getDay();
      const numberOfDaysToPreviousMonday = selectedDayOfTheWeek === 0 ? 7 : selectedDayOfTheWeek;

      this.mondayInSelectedWeek = decrementDays(this.selectedDate, numberOfDaysToPreviousMonday - 1);
    },
    formatDateToString: formatDateToString,
    getWeek: getWeek,
    incrementDays: incrementDays
  },
  computed: {
    selectedPeriod(): string {
      const sundayInSelectedWeek = incrementDays(this.mondayInSelectedWeek, 6);

      return formatDateToString(this.mondayInSelectedWeek) + ' - ' + formatDateToString(sundayInSelectedWeek);
    }
  }
})
</script>
