<template>
  <article class="card padding-075rem" :class="colourClass">
    <header>
      <div class="title">
        <strong>{{ search.company }}</strong>
        <small> ({{ search.category }})</small>
      </div>
      <div class="controls">
        <!-- 🆕 Colour selector -->
        <ColourTag 
          type="search" 
          :id="search.id" 
          v-model="selectedColour" 
        />
        <button @click="$emit('edit')">Edit</button>
        <button @click="$emit('delete')">Delete</button>
      </div>
    </header>

    <p>{{ search.comment }}</p>

    <ul class="details">
      <li>Salary: {{ search.salary || '—' }}</li>
      <li>Next: {{ search.nextStep || '—' }}</li>
      <li>ToDo: {{ search.toDo || '—' }}</li>
      <li>Closing: 
        <time :datetime="search.closingDate">{{ formatDate(search.closingDate) }}</time>
      </li>
    </ul>

    <section class="locations">
      <h4>Locations</h4>
      <div v-if="(search.locations || []).length === 0">No locations yet</div>
      <ul>
        <li v-for="loc in search.locations" :key="loc.id">
          <div>
            <div>
            <strong>{{ loc.category }}</strong> — {{ loc.address }}
            </div>
            <div class = "button-group">
              <button @click="$emit('edit', { type: 'location', item: loc })">Edit</button>
              <button @click="$emit('delete', { type: 'location', id: loc.id })">Delete</button>
            </div>
            <div class="comment">{{ loc.comment }}</div>
          </div>
        </li>
      </ul>
      <div>
        <button @click="$emit('add-location')">Add Location</button>
      </div>
    </section>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import ColourTag from './ColourTag.vue'

const props = defineProps({ search: Object })
const selectedColour = ref(props.search.colour || '')

const colourClass = computed(() =>
  selectedColour.value ? `card-${selectedColour.value}` : ''
)

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString()
}
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



</style>
