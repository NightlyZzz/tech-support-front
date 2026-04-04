import { ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

export const usePagination = () => {
    const currentPage = ref<number>(1)
    const lastPage = ref<number>(1)

    const setMeta = (paginationMeta: PaginationMeta) => {
        const rawLastPage = paginationMeta.last_page
        const normalizedLastPage = Array.isArray(rawLastPage) ? rawLastPage[0] : rawLastPage

        lastPage.value = normalizedLastPage || 1

        if (currentPage.value > lastPage.value) {
            currentPage.value = lastPage.value
        }
    }

    return {
        currentPage,
        lastPage,
        setMeta
    }
}