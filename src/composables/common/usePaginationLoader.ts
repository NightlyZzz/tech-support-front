import { watch, type Ref } from 'vue'
import type { PaginationMeta } from '@/types/common'

type SetMeta = (meta: PaginationMeta) => void
type LoadPage = (page: number, setMeta: SetMeta) => Promise<void>

export const usePaginationLoader = (
        currentPage: Ref<number>,
        load: LoadPage,
        setMeta: SetMeta
) => {
    const loadPage = async (page: number): Promise<void> => {
        if (page < 1 || page === currentPage.value) {
            return
        }

        currentPage.value = page
    }

    watch(currentPage, async (nextPage, previousPage) => {
        if (nextPage === previousPage) {
            return
        }

        await load(nextPage, setMeta)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    return {
        loadPage
    }
}