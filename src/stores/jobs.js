import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useJobsStore = defineStore('jobs', () => {
  const loading = ref(false)
  const error = ref(null)
  const searches = ref([])
  const strategies = ref([])
  const news = ref([])

  // 🆕 Persisted filters
  const filters = ref({
    strategyCategory: '',
    searchCategory: '',
    colour: '',
    searchTerm: ''
  })

  // Load filters from localStorage when store initializes
  const saved = localStorage.getItem('jobsFilters')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Ensure all expected keys exist to avoid "undefined"
      filters.value = {
        strategyCategory: parsed.strategyCategory || '',
        searchCategory: parsed.searchCategory || '',
        colour: parsed.colour || '',
        searchTerm: parsed.searchTerm || ''
      }
    } catch (e) {
      console.warn('Failed to parse saved filters:', e)
    }
  }


  // Watch for changes and persist automatically
  watch(filters, (val) => {
    localStorage.setItem('jobsFilters', JSON.stringify(val))
  }, { deep: true })

  async function loadReport() {
    console.log("stores-job-loadReport")
    loading.value = true
    error.value = null
    try {
      const report = await api.fetchReport()
      console.log("stores-job-loadReport-report", report)
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

  async function fetchNews(type) {
    console.log("stores-job-fetchNews", type)
    try {
      const data = await api.fetchNews(type)
      news.value = data.news || []
      console.log("stores-job-fetchNews-news", news.value)
    } catch (err) {
      console.error("Failed to load news", err)
    }
  }

  return {
    loading, error, searches, strategies, news, 
    filters, loadReport, addItem, updateItem, deleteItem, fetchNews
  }
})
