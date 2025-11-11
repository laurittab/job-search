<template>
  <article class="card padding-075rem" :class="colourClass">
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
      <small class="italic-text">{{ strategy.nextStep || '—' }}</small>
      <small>{{ strategy.toDo || '—' }}</small>
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
  margin-top: 6px;
}

.italic-text {
    font-style: italic;
}

.meta small {
  display: block; 
  margin-top: 6px; 
}
</style>
