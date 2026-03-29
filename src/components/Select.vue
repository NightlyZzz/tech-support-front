<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="internalValue"
      @input="onInput"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option
        v-for="item in items"
        :key="item[valueKey]"
        :value="item[valueKey]"
      >
        {{ item[labelKey] }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  placeholder: string
  items: any[]
  modelValue: any
  valueKey: string
  labelKey: string
}>()

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val: any) => emit('update:modelValue', val)
})

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>
