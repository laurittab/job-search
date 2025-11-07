<template>
  <article class="card" :class="colourClass">
    <header>
      <div class="title">
        <strong>{{ strategy.item }}</strong>
        <small> ({{ strategy.category }})</small>
      </div>
      <div class="controls">
        <!-- 🆕 Colour selector -->
        <ColourTag 
          type="strategy" 
          :id="strategy.id" 
          v-model="selectedColour" 
        />
        <button @click="$emit('edit')">Edit</button>
        <button @click="$emit('delete')">Delete</button>
      </div>
    </header>

    <p>{{ strategy.comment }}</p>
    <div class="meta">
      <small>Next: {{ strategy.nextStep || '—' }}</small>
      <small>ToDo: {{ strategy.toDo || '—' }}</small>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ColourTag from './ColourTag.vue'
import { useJobsStore } from '../stores/jobs.js'

const props = defineProps({ strategy: Object })
const store = useJobsStore()

// 🆕 Local colour state
const selectedColour = ref(props.strategy.colour || '')

// Compute class name dynamically
const colourClass = computed(() =>
  selectedColour.value ? `card-${selectedColour.value}` : ''
)

// Persist colour change automatically
watch(selectedColour, async (newVal) => {
  await store.updateItem('strategy', props.strategy.id, { colour: newVal })
})
</script>

<style scoped>
.card {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.card-red {
  background-color: #ffe5e5;
  border-color: #ff9b9b;
}

.card-amber {
  background-color: #fff7e0;
  border-color: #ffd666;
}

.card-green {
  background-color: #e7ffe7;
  border-color: #9bff9b;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions button {
  margin-right: 0.5rem;
}
</style>
