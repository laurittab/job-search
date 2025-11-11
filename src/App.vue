<template>
  <div class="app">
    <header class="header">
      <h1>Jobs & Strategies Report</h1>
      <div class="controls">
        <!-- Category Filters -->
        <select v-model="filters.strategyCategory">
          <option value="">All Strategies</option>
          <option value="miscellaneous">Miscellaneous</option>
          <option value="networking">Networking</option>
          <option value="interviews">Interviews</option>
          <option value="upskilling">Upskilling</option>
          <option value="applications">Applications</option>
        </select>

        <select v-model="filters.searchCategory">
          <option value="">All Searches</option>
          <option value="giant">Giant</option>
          <option value="startup">Startup</option>
          <option value="fintech">Fintech</option>
          <option value="enterprise">Enterprise</option>
          <option value="consultancy">Consultancy</option>
          <option value="non-tech">Non-Tech</option>
        </select>

        <!-- 🆕 Colour filter -->
        <select v-model="filters.colour">
          <option value="">All Colours</option>
          <option value="red">Red</option>
          <option value="amber">Amber</option>
          <option value="green">Green</option>
          <option value="none">No Colour</option>
        </select>

        <!-- Fuzzy search -->
        <div class="search-box">
          <input v-model="filters.searchTerm" type="text" placeholder="Search keywords..." />
          <button v-if="filters.searchTerm" @click="filters.searchTerm = ''" class="clear-btn" title="Clear search">
            ✕
          </button>
        </div>

        <!-- Existing buttons -->
        <button @click="refresh" :disabled="store.loading">Refresh</button>
        <button @click="openAdd('search')">New Search</button>
        <button @click="openAdd('strategy')">New Strategy</button>
      </div>
    </header>

    <main class="main-content">
      <div class="report-area">
        <section v-if="store.loading">Loading report…</section>
        <section v-else>
          <JobsReport :searches="filteredSearches" :strategies="filteredStrategies" @edit="onEdit" @delete="onDelete"
            @add-location="openAddLocation" />
        </section>
      </div>

      <NewsFeed />
    </main>

    <JobForm v-if="editing" :type="editing.type" :item="editing.item" @close="editing = null" @saved="onSaved" />

    <LocationForm v-if="addingLocation" :searchId="addingLocation.searchId" @close="addingLocation = null"
      @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Fuse from 'fuse.js'
import { storeToRefs } from 'pinia'
import { useJobsStore } from './stores/jobs.js'
import JobsReport from './components/JobsReport.vue'
import JobForm from './components/JobForm.vue'
import LocationForm from './components/LocationForm.vue'
import NewsFeed from './components/NewsFeed.vue'

const store = useJobsStore()
const editing = ref(null)
const addingLocation = ref(null)
const { filters } = storeToRefs(store)  // <-- filters is a ref({})
// In template, you can use filters.strategyCategory (auto-unwrapped)
// In script, you must use filters.value.strategyCategory

// 🧮 Fuse.js options
const strategyFuseOptions = {
  keys: ['category', 'item', 'comment', 'nextStep', 'toDo'],
  threshold: 0.6,
}
const searchFuseOptions = {
  keys: ['category', 'company', 'comment', 'nextStep', 'toDo', 'salary', 'role'],
  threshold: 0.6,
}

// 🧩 Apply filters
const filteredStrategies = computed(() => {
  let items = store.strategies

  const f = filters.value // shorthand
  if (f.strategyCategory)
    items = items.filter(s => s.category === f.strategyCategory)

  if (f.colour) {
    items = items.filter(s => {
      if (f.colour === 'none') return !s.colour
      return s.colour === f.colour
    })
  }

  if (f.searchTerm.trim()) {
    const fuse = new Fuse(items, strategyFuseOptions)
    items = fuse.search(f.searchTerm).map(r => r.item)
  }

  return items
})

const filteredSearches = computed(() => {
  let items = store.searches
  const f = filters.value

  if (f.searchCategory)
    items = items.filter(s => s.category === f.searchCategory)

  if (f.colour) {
    items = items.filter(s => {
      if (f.colour === 'none') return !s.colour
      return s.colour === f.colour
    })
  }

  if (f.searchTerm.trim()) {
    const fuse = new Fuse(items, searchFuseOptions)
    items = fuse.search(f.searchTerm).map(r => r.item)
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

select,
input {
  padding: 0.25rem 0.5rem;
}

.search-box {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.clear-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  margin-left: -1.5rem;
  /* nudges x closer to input edge */
  color: #666;
}

.clear-btn:hover {
  color: #000;
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.report-area {
  flex: 1;
}
</style>
