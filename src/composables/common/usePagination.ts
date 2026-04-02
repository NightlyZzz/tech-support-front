import { ref } from 'vue'

export const usePagination = () => {
    const currentPage = ref(1)
    const lastPage = ref(1)

    const setMeta = (meta: any) => {
        const raw = meta?.last_page ?? 1
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
