import { ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

export const usePagination = () => {
    const currentPage = ref(1)
    const lastPage = ref(1)
    const totalItems = ref(0)

    const setMeta = (paginationMeta: PaginationMeta): void => {
        lastPage.value = Math.max(1, paginationMeta.last_page || 1)
        totalItems.value = Math.max(0, paginationMeta.total || 0)

        if (currentPage.value > lastPage.value) {
            currentPage.value = lastPage.value
        }

        if (currentPage.value < 1) {
            currentPage.value = 1
        }
    }

    return {
        currentPage,
        lastPage,
        totalItems,
        setMeta
    }
}