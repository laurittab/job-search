<template>
    <article class="card">
        <header>
            <strong>{{ strategy.item }}</strong>
            <small> ({{ strategy.category }})</small>
        </header>
        <p>{{ strategy.comment }}</p>
        <div class="meta">
            <small>Next: {{ strategy.nextStep || '—' }}</small>
            <small>ToDo: {{ strategy.toDo || '—' }}</small>
        </div>
        <div class="actions">
            <button @click="$emit('edit')">Edit</button>
            <button @click="$emit('delete')">Delete</button>
        </div>
    </article>
</template>

<script setup>
const props = defineProps({ strategy: Object })
</script>

<style scoped>
.card {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px
}

.actions button {
    margin-right: 0.5rem
}
</style>