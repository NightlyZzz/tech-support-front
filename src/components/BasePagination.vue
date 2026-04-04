<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        modelValue: number
        lastPage: number
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', page: number): void
    }>()

    const changePage = (nextPage: number) => {
        if (nextPage < 1 || nextPage > props.lastPage || nextPage === props.modelValue) {
            return
        }

        emit('update:modelValue', nextPage)
    }

    const pages = computed<(number | string)[]>(() => {
        const totalPages = props.lastPage
        const currentPage = props.modelValue
        const visiblePages: (number | string)[] = []

        if (totalPages <= 7) {
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                visiblePages.push(pageNumber)
            }

            return visiblePages
        }

        visiblePages.push(1)

        if (currentPage > 3) {
            visiblePages.push('...')
        }

        for (let pageNumber = currentPage - 1; pageNumber <= currentPage + 1; pageNumber++) {
            if (pageNumber > 1 && pageNumber < totalPages) {
                visiblePages.push(pageNumber)
            }
        }

        if (currentPage < totalPages - 2) {
            visiblePages.push('...')
        }

        visiblePages.push(totalPages)

        return visiblePages
    })
</script>

<template>
    <div class="pagination">
        <button
                class="btn"
                @click="changePage(modelValue - 1)"
                :disabled="modelValue === 1"
        >
            ←
        </button>

        <template v-for="pageItem in pages" :key="pageItem + '-' + modelValue">
            <button
                    v-if="typeof pageItem === 'number'"
                    class="btn"
                    :class="{ active: pageItem === modelValue }"
                    @click="changePage(pageItem)"
            >
                {{ pageItem }}
            </button>

            <span v-else class="dots">...</span>
        </template>

        <button
                class="btn"
                @click="changePage(modelValue + 1)"
                :disabled="modelValue === lastPage"
        >
            →
        </button>
    </div>
</template>

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