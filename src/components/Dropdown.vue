<template>
  <select>
    <option v-for="(el, index) in data" :key="index" value="{{ el?.id }}" :selected="el.id === selectedId">
      {{ el?.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ActivityAndProject } from "../models/timesheetResponse.interface";

export default defineComponent({
  name: "Dropdown",
  props: {
    data: {
      type: Object as PropType<ActivityAndProject[]>,
      required: true
    },
    selectedId: {
      type: Number
    }
  },
});
</script>
