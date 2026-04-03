import { ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

export const usePagination = () => {
    const currentPage = ref<number>(1)
    const lastPage = ref<number>(1)

    const setMeta = (meta: PaginationMeta) => {
        const raw = meta.last_page
        lastPage.value = Array.isArray(raw) ? raw[0] : raw

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