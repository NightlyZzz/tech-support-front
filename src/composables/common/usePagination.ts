import { ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

export const usePagination = () => {
    const currentPage = ref<number>(1)
    const lastPage = ref<number>(1)

    const setMeta = (meta: PaginationMeta) => {
        lastPage.value = meta.last_page

        if (currentPage.value > lastPage.value) {
            currentPage.value = lastPage.value || 1
        }
    }

    return {
        currentPage,
        lastPage,
        setMeta
    }
}