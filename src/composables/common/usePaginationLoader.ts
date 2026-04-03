import type { Ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

export const usePaginationLoader = (
        currentPage: Ref<number>,
        load: (page: number, setMeta: (meta: PaginationMeta) => void) => Promise<void>,
        setMeta: (meta: PaginationMeta) => void
) => {
    const loadPage = async (page: number) => {
        currentPage.value = page
        await load(currentPage.value, setMeta)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return { loadPage }
}