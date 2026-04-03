import { ref } from 'vue'

interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

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