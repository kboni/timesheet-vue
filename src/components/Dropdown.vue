<template>
  <select
    v-model="selectedId"
    @change="onSelectChange">
    <option v-for="(el, index) in options" :key="index" 
      :value="el?.id" 
      :selected="el?.id === initSelectedId">
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
    options: {
      type: Object as PropType<ActivityAndProject[]>,
      required: true
    },
    initSelectedId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedId: this.initSelectedId
    }
  },
  methods: {
    onSelectChange(event: any) {
      this.$emit('input', event.target.value);
    }
  }
});
</script>
