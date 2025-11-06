import axios from 'axios'


const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})


export default {
    async fetchReport() {
        const res = await api.get('/jobs')
        return res.data
    },
    async add(type, payload) {
        const res = await api.post(`/jobs/${type}`, payload)
        return res.data
    },
    async update(type, id, payload) {
        const res = await api.put(`/jobs/${type}/${id}`, payload)
        return res.data
    },
    async remove(type, id) {
        const res = await api.delete(`/jobs/${type}/${id}`)
        return res.data
    }
}