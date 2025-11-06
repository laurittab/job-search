import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useJobsStore = defineStore('jobs', () => {
    const loading = ref(false)
    const error = ref(null)
    const searches = ref([])
    const strategies = ref([])

    async function loadReport() {
        console.log("stores-job-loadReport")
        loading.value = true
        error.value = null
        try {
            const report = await api.fetchReport()
            console.log("stores-job-loadReport-report", report);
            searches.value = report.searches || []
            strategies.value = report.strategies || []
        } catch (err) {
            error.value = err
        } finally {
            loading.value = false
        }
    }

    async function addItem(type, payload) {
        const created = await api.add(type, payload)
        // naive local update — refresh recommended for strong consistency
        await loadReport()
        return created
    }

    async function updateItem(type, id, payload) {
        const updated = await api.update(type, id, payload)
        await loadReport()
        return updated
    }

    async function deleteItem(type, id) {
        const removed = await api.remove(type, id)
        await loadReport()
        return removed
    }

    return { loading, error, searches, strategies, loadReport, addItem, updateItem, deleteItem }
})