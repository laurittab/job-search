<template>
    <div class="report">
        <section class="strategies">
            <h2>Strategies</h2>
            <div v-if="strategies.length === 0">No strategies</div>
            <ul>
                <li v-for="s in strategies" :key="s.id">
                    <StrategyCard :strategy="s" @edit="$emit('edit', { type: 'strategy', item: s })"
                        @delete="$emit('delete', { type: 'strategy', id: s.id })" />
                </li>
            </ul>
        </section>

        <section class="searches">
            <h2>Searches</h2>
            <div v-if="searches.length === 0">No searches</div>
            <ul>
                <li v-for="search in searches" :key="search.id">
                    <SearchCard :search="search" @edit="$emit('edit', { type: 'search', item: search })"
                        @delete="$emit('delete', { type: 'search', id: search.id })"
                        @add-location="$emit('add-location', search.id)" />
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import StrategyCard from './StrategyCard.vue'
import SearchCard from './SearchCard.vue'

defineProps({ searches: Array, strategies: Array })
</script>

<style scoped>
.report {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem
}
</style>