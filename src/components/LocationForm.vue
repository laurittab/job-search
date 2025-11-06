<template>
    <div class="modal">
        <div class="panel">
            <h3>Add Location</h3>
            <form @submit.prevent="save">
                <label>Category<input v-model="form.category" /></label>
                <label>Address<input v-model="form.address" /></label>
                <label>Comment<textarea v-model="form.comment"></textarea></label>
                <div class="actions">
                    <button type="submit">Save</button>
                    <button type="button" @click="$emit('close')">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useJobsStore } from '../stores/jobs'
const props = defineProps({ searchId: [String, Number] })
const emit = defineEmits(['close', 'saved'])
const store = useJobsStore()

const form = reactive({ category: '', address: '', comment: '' })

async function save() {
    // server expects type=location; payload should include searchId - adjust as backend expects
    const payload = { ...form, searchId: props.searchId }
    await store.addItem('location', payload)
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