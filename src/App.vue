<template>
    <div class="app">
        <header class="header">
            <h1>Jobs & Strategies Report</h1>
            <div class="controls">
                <button @click="refresh" :disabled="store.loading">Refresh</button>
                <button @click="openAdd('search')">New Search</button>
                <button @click="openAdd('strategy')">New Strategy</button>
            </div>
        </header>


        <main>
            <section v-if="store.loading">Loading report…</section>
            <section v-else>
                <JobsReport :searches="store.searches" :strategies="store.strategies" @edit="onEdit" @delete="onDelete"
                    @add-location="openAddLocation" />
            </section>
        </main>


        <JobForm v-if="editing" :type="editing.type" :item="editing.item" @close="editing = null" @saved="onSaved" />
        <LocationForm v-if="addingLocation" :searchId="addingLocation.searchId" @close="addingLocation = null"
            @saved="onSaved" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useJobsStore } from './stores/jobs.js'
import JobsReport from './components/JobsReport.vue'
import JobForm from './components/JobForm.vue'
import LocationForm from './components/LocationForm.vue'

const store = useJobsStore()
const editing = ref(null)
const addingLocation = ref(null)

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
    font-family: system-ui, sans-serif
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.controls button {
    margin-left: 0.5rem
}
</style>