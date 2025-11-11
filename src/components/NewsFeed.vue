<template>
  <aside class="news-feed scroller margin-0">
    <h2>Tech News</h2>
    <ul>
      <li v-for="item in news" :key="item.link" class="news-item">
        <a :href="item.link" target="_blank" class="title">{{ item.title }}</a>
        <p class="date">{{ formatDate(item.date) }}</p>
        <p class="desc">{{ item.description }}</p>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '../stores/jobs.js'

const store = useJobsStore()
const { news } = storeToRefs(store)

onMounted(() => store.fetchNews("tech"))
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<style scoped>
.news-feed {
  width: 300px;
  flex-shrink: 0;
  background: #fafafa;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  max-height: 80vh;
}

.news-feed h2 {
  margin-bottom: 1rem;
}

.news-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.news-item .title {
  font-weight: bold;
  text-decoration: none;
  color: #0073e6;
}

.news-item .title:hover {
  text-decoration: underline;
}

.news-item .date {
  font-size: 0.8rem;
  color: #666;
}

.news-item .desc {
  font-size: 0.9rem;
  color: #444;
}
</style>
