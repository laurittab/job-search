add a fuzzy word search to filter the report

Perfect addition — a fuzzy word search makes your report much easier to explore.

Let’s add it cleanly to your existing setup, so it filters across both Search and Strategy titles, notes, or descriptions (you can adjust the fields).

✅ Step-by-Step Implementation
1. Install fuse.js (if not already)

If your project uses npm:

npm install fuse.js


or with yarn:

yarn add fuse.js

2. Add a search box and fuse-based filter logic

Here’s your updated component, with fuzzy search integrated.

<template>
  <div class="app">
    <header class="header">
      <h1>Jobs & Strategies Report</h1>
      <div class="controls">
        <!-- 🆕 Dropdown filters -->
        <select v-model="selectedStrategyCategory">
          <option value="">All Strategies</option>
          <option value="miscellaneous">Miscellaneous</option>
          <option value="networking">Networking</option>
          <option value="interviews">Interviews</option>
          <option value="upskilling">Upskilling</option>
          <option value="applications">Applications</option>
        </select>

        <select v-model="selectedSearchCategory">
          <option value="">All Searches</option>
          <option value="giant">Giant</option>
          <option value="startup">Startup</option>
          <option value="fintech">Fintech</option>
          <option value="enterprise">Enterprise</option>
          <option value="consultancy">Consultancy</option>
          <option value="non-tech">Non-Tech</option>
        </select>

        <!-- 🆕 Fuzzy text search -->
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search keywords..."
        />

        <!-- Existing buttons -->
        <button @click="refresh" :disabled="store.loading">Refresh</button>
        <button @click="openAdd('search')">New Search</button>
        <button @click="openAdd('strategy')">New Strategy</button>
      </div>
    </header>

    <main>
      <section v-if="store.loading">Loading report…</section>
      <section v-else>
        <JobsReport
          :searches="filteredSearches"
          :strategies="filteredStrategies"
          @edit="onEdit"
          @delete="onDelete"
          @add-location="openAddLocation"
        />
      </section>
    </main>

    <JobForm
      v-if="editing"
      :type="editing.type"
      :item="editing.item"
      @close="editing = null"
      @saved="onSaved"
    />

    <LocationForm
      v-if="addingLocation"
      :searchId="addingLocation.searchId"
      @close="addingLocation = null"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Fuse from 'fuse.js'
import { useJobsStore } from './stores/jobs.js'
import JobsReport from './components/JobsReport.vue'
import JobForm from './components/JobForm.vue'
import LocationForm from './components/LocationForm.vue'

const store = useJobsStore()
const editing = ref(null)
const addingLocation = ref(null)

// 🆕 Filters
const selectedStrategyCategory = ref('')
const selectedSearchCategory = ref('')
const searchTerm = ref('')

// 🧮 Fuse.js search options
const strategyFuseOptions = {
  keys: ['title', 'description', 'notes'],
  threshold: 0.3, // lower = stricter match
}

const searchFuseOptions = {
  keys: ['title', 'company', 'notes'],
  threshold: 0.3,
}

// 🧠 Computed: apply both category + fuzzy search filters
const filteredStrategies = computed(() => {
  let items = store.strategies

  // Category filter
  if (selectedStrategyCategory.value) {
    items = items.filter(
      (s) => s.category === selectedStrategyCategory.value
    )
  }

  // Fuzzy search
  if (searchTerm.value.trim()) {
    const fuse = new Fuse(items, strategyFuseOptions)
    return fuse.search(searchTerm.value).map(r => r.item)
  }

  return items
})

const filteredSearches = computed(() => {
  let items = store.searches

  // Category filter
  if (selectedSearchCategory.value) {
    items = items.filter(
      (s) => s.category === selectedSearchCategory.value
    )
  }

  // Fuzzy search
  if (searchTerm.value.trim()) {
    const fuse = new Fuse(items, searchFuseOptions)
    return fuse.search(searchTerm.value).map(r => r.item)
  }

  return items
})

onMounted(() => store.loadReport())

function refresh() { store.loadReport() }
function openAdd(type) { editing.value = { type, item: null } }
function openAddLocation(searchId) { addingLocation.value = { searchId } }

function onEdit(payload) {
  editing.value = { type: payload.type, item: payload.item }
}

function onDelete(payload) {
  if (!confirm('Delete this item?')) return
  store.deleteItem(payload.type, payload.id)
}

async function onSaved() {
  editing.value = null
  addingLocation.value = null
  await store.loadReport()
}
</script>

<style scoped>
.app {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

select, input {
  padding: 0.25rem 0.5rem;
}
</style>

🔍 How It Works

The searchTerm input is bound via v-model.

Each computed property:

First filters by category.

Then applies a fuzzy search (via Fuse.js) over specified keys.

Results are live-updated as the user types.

🧠 Tip:

You can tune the fuzzy sensitivity via threshold:

0.1 → very strict (exact-ish matches)

0.3 → balanced

0.6+ → loose matching

Would you like the fuzzy search to search both Strategies and Searches at once (single combined list), or keep them filtered separately as above?