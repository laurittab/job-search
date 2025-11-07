<template>
  <div class="colour-tag" :class="colourClass">
    <select v-model="selectedColour" @change="updateColour">
      <option value="">No Colour</option>
      <option value="red">Red</option>
      <option value="amber">Amber</option>
      <option value="green">Green</option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useJobsStore } from '../stores/jobs'

const props = defineProps({
  type: { type: String, required: true }, // 'search' or 'strategy'
  id: { type: [String, Number], required: true },
  modelValue: { type: String, default: '' } // initial colour
})

const emit = defineEmits(['update:modelValue'])
const store = useJobsStore()

const selectedColour = ref(props.modelValue)

// keep parent in sync
watch(selectedColour, (val) => emit('update:modelValue', val))

const colourClass = computed(() => {
  return selectedColour.value ? `colour-${selectedColour.value}` : ''
})

function updateColour() {
  // optional: persist immediately to store/backend
  store.updateItem(props.type, props.id, { colour: selectedColour.value })
}
</script>

<style scoped>
.colour-tag select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #ccc;
}

.colour-red select {
  background-color: #ffe5e5;
  border-color: #ff9b9b;
}

.colour-amber select {
  background-color: #fff7e0;
  border-color: #ffd666;
}

.colour-green select {
  background-color: #e7ffe7;
  border-color: #9bff9b;
}
</style>
