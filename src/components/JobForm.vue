<template>
    <div class="modal">
        <div class="panel">
            <h3>{{ isNew ? 'Add' : 'Edit' }} {{ typeLabel }}</h3>
            <form @submit.prevent="save">
                <div v-if="type === 'search'">
                    <label>Company<input v-model="form.company" /></label>
                    <label>Role<input v-model="form.role" /></label>
                    <label>Category<input v-model="form.category" /></label>
                    <label>Salary<input type="number" v-model.number="form.salary" /></label>
                    <label>Closing Date<input type="datetime-local" v-model="form.closingDateLocal" /></label>
                    <label>Comment<textarea v-model="form.comment"></textarea></label>
                    <label>Next Step<input v-model="form.nextStep" /></label>
                    <label>To Do<input v-model="form.toDo" /></label>
                </div>

                <div v-if="type === 'strategy'">
                    <label>Category<input v-model="form.category" /></label>
                    <label>Item<input v-model="form.item" /></label>
                    <label>Comment<textarea v-model="form.comment"></textarea></label>
                    <label>Next Step<input v-model="form.nextStep" /></label>
                    <label>To Do<input v-model="form.toDo" /></label>
                </div>

                <div class="actions">
                    <button type="submit">Save</button>
                    <button type="button" @click="$emit('close')">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useJobsStore } from '../stores/jobs'

const props = defineProps({ type: String, item: Object })
const emit = defineEmits(['close', 'saved'])
const store = useJobsStore()

const isNew = computed(() => !props.item)
const type = props.type || 'search'

const form = reactive({})

if (props.item) {
    // copy fields
    Object.assign(form, props.item)
    if (props.item.closingDate) {
        // convert to local datetime input format
        const d = new Date(props.item.closingDate)
        const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        form.closingDateLocal = isoLocal
    }
} else {
    // defaults
    if (type === 'search') {
        Object.assign(form, { company: '', role: '', category: '', salary: null, comment: '', nextStep: '', toDo: '', closingDateLocal: null })
    } else {
        Object.assign(form, { category: '', item: '', comment: '', nextStep: '', toDo: '' })
    }
}

const typeLabel = type === 'search' ? 'Search' : 'Strategy'

async function save() {
    // normalize payload
    const payload = { ...form }
    if (form.closingDateLocal) {
        const dt = new Date(form.closingDateLocal)
        payload.closingDate = dt.toISOString()
        delete payload.closingDateLocal
    }

    if (isNew.value) {
        await store.addItem(type, payload)
    } else {
        await store.updateItem(type, props.item.id, payload)
    }

    emit('saved')
}
</script>

<style scoped>
.modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.35)
}

.panel {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    width: min(720px, 95%)
}

label {
    display: block;
    margin-bottom: 0.5rem
}

.actions {
    margin-top: 1rem
}
</style>