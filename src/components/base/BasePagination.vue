<script setup lang="ts">
    import { computed } from 'vue'
    import BaseButton from '@/components/base/BaseButton.vue'

    type PaginationItem = number | 'ellipsis'

    const props = defineProps<{
        modelValue: number
        lastPage: number
    }>()

    const emit = defineEmits<{
        (event: 'update:modelValue', page: number): void
    }>()

    const changePage = (nextPage: number): void => {
        if (nextPage < 1 || nextPage > props.lastPage || nextPage === props.modelValue) {
            return
        }

        emit('update:modelValue', nextPage)
    }

    const pages = computed<PaginationItem[]>(() => {
        const totalPages = Math.max(1, props.lastPage)
        const currentPage = Math.min(Math.max(1, props.modelValue), totalPages)
        const visiblePages: PaginationItem[] = []

        if (totalPages <= 7) {
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                visiblePages.push(pageNumber)
            }

            return visiblePages
        }

        visiblePages.push(1)

        if (currentPage > 3) {
            visiblePages.push('ellipsis')
        }

        for (let pageNumber = currentPage - 1; pageNumber <= currentPage + 1; pageNumber++) {
            if (pageNumber > 1 && pageNumber < totalPages) {
                visiblePages.push(pageNumber)
            }
        }

        if (currentPage < totalPages - 2) {
            visiblePages.push('ellipsis')
        }

        visiblePages.push(totalPages)

        return visiblePages
    })
</script>

<template>
    <div v-if="lastPage > 1" class="pagination">
        <BaseButton
                type="button"
                variant="secondary"
                class="pagination-button"
                :disabled="modelValue === 1"
                @click="changePage(modelValue - 1)"
        >
            ←
        </BaseButton>

        <template v-for="(pageItem, index) in pages" :key="`${pageItem}-${index}`">
            <BaseButton
                    v-if="typeof pageItem === 'number'"
                    type="button"
                    :variant="pageItem === modelValue ? 'primary' : 'secondary'"
                    :class="['pagination-button', pageItem === modelValue ? 'is-active' : '']"
                    @click="changePage(pageItem)"
            >
                {{ pageItem }}
            </BaseButton>

            <span v-else class="pagination-dots">...</span>
        </template>

        <BaseButton
                type="button"
                variant="secondary"
                class="pagination-button"
                :disabled="modelValue === lastPage"
                @click="changePage(modelValue + 1)"
        >
            →
        </BaseButton>
    </div>
</template>

<style scoped>
    @import '@/assets/pagination.css';
</style>