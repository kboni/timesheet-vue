<template>
  <input type="text" :disabled="true"
    :value="totalTime" />
</template>

<script lang="ts">
import { Day } from "@/enums/day.enum";
import { HoursPerDay, TimesheetRow } from "@/models/timesheetResponse.interface";
import { secondsToTimeString, timeStringtoSeconds } from "@/utils/datetime";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "TotalHours",
  props: {
    timesheetRows: {
      type: Object as PropType<TimesheetRow[]>,
      required: true
    },
    day: {
      type: Number as PropType<Day>,
      required: true
    }
  },
  data() {
    return {
      totalHours: 0,
      totalTime: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    calculateTotalHours() {
      this.timesheetRows.forEach((timesheet: TimesheetRow) => {
        this.totalHours += timeStringtoSeconds(this.getHours(this.day, timesheet.hoursPerDay));
        console.log(this.totalHours )
      })
      this.totalTime = secondsToTimeString(this.totalHours);
      this.$emit('update:modelValue', this.totalTime)
    },
    getHours(day: Day, hoursPerDay: HoursPerDay): string {
      switch (day) {
        case Day.MONDAY:
          return hoursPerDay.monday;
        case Day.TUESDAY:
          return hoursPerDay.tuesday;
        case Day.WEDNESDAY:
          return hoursPerDay.wednesday;
        case Day.THURSDAY:
          return hoursPerDay.thursday;
        case Day.FRIDAY:
          return hoursPerDay.friday;
        case Day.SATURDAY:
          return hoursPerDay.saturday;
        case Day.SUNDAY:
          return hoursPerDay.sunday;
      }
    }
  },
  mounted() {
    this.calculateTotalHours();
  }
});
</script>
