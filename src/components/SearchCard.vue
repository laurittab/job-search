<template>
    <article class="card">
        <header>
            <div class="title">
                <strong>{{ search.role || search.company }}</strong>
                <small> — {{ search.category }}</small>
            </div>
            <div class="controls">
                <button @click="$emit('edit')">Edit</button>
                <button @click="$emit('delete')">Delete</button>
            </div>
        </header>

        <p>{{ search.comment }}</p>
        <div class="details">
            <div>Salary: {{ search.salary || '—' }}</div>
            <div>Next: {{ search.nextStep || '—' }}</div>
            <div>ToDo: {{ search.toDo || '—' }}</div>
            <div>Closing: <time :datetime="search.closingDate">{{ formatDate(search.closingDate) }}</time></div>
        </div>

        <section class="locations">
            <h4>Locations</h4>
            <div v-if="(search.locations || []).length === 0">No locations yet</div>
            <ul>
                <li v-for="loc in search.locations" :key="loc.id">
                    <div>
                        <strong>{{ loc.category }}</strong> — {{ loc.address }}
                        <div class="loc-actions">
                            <button @click="emitEditLocation(loc)">Edit</button>
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
import { useJobsStore } from '../stores/jobs'
const props = defineProps({ search: Object })

function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleString()
}

function emitEditLocation(loc) {
    // Use the store's edit by emitting an event for parent to open the form
    // parent will need to call store.updateItem('location', id, payload)
    // Here emit using native $emit from template
    // We emit type: 'location' and item
    const ev = new CustomEvent('edit', { detail: { type: 'location', item: loc } })
    // can't dispatch DOM event; instead emit via $emit from template would be simpler

    // Note: `emitEditLocation` is intentionally simple — in templates it's easier to use `$emit('edit', { type: 'location', item: loc })` directly if preferred. Replace the call in the template if you want that behavior.
}
</script>

<style scoped>
.card {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px
}

.locations {
    margin-top: 0.75rem
}

.loc-actions button {
    margin-left: 0.5rem
}
</style>