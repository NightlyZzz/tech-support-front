<template>
  <div class="pagination">
    <button class="btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      ←
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="btn"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
      v-if="page !== '...'"
    >
      {{ page }}
    </button>

    <span v-else class="dots">...</span>

    <button class="btn" @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage">
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  lastPage: number
}>()

const emit = defineEmits(['change'])

const changePage = (page: number) => {
  if (page < 1 || page > props.lastPage) return
  emit('change', page)
}

const pages = computed(() => {
  const total = props.lastPage
  const current = props.currentPage

  const result: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) result.push(i)
  } else {
    result.push(1)

    if (current > 3) result.push('...')

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) result.push(i)
    }

    if (current < total - 2) result.push('...')

    result.push(total)
  }

  return result
})
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn.active {
  background: #3b82f6;
  color: white;
}

.dots {
  padding: 6px 10px;
}
</style>
