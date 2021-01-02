<template>
  <input type="text"
    v-model="time"
    @change="onTimeChange" />
</template>

<script lang="ts">
import { secondsToTimeString, timeStringtoSeconds } from "@/utils/datetime";
import { defineComponent } from "vue";

export default defineComponent({
  name: "WeekdayTextInput",
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hours: this.modelValue,
      time: 'bn'
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onTimeChange() {
      this.time = this.formatTime(this.hours)
      this.$emit('update:modelValue', this.time)
    },
    formatTime(input: string): string {
      const timeParts = input.split(':');
      if (timeParts.length < 2) {
        input += ':00';
      }
      return secondsToTimeString(timeStringtoSeconds(input));
    }
  }
});
</script>
