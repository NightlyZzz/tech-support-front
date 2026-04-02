import type { Ref } from 'vue'

export const usePaginationLoader = (
    currentPage: Ref<number>,
    load: (page: number, setMeta: (meta: any) => void) => Promise<void>,
    setMeta: (meta: any) => void
) => {
    const loadPage = async (page: number) => {
        currentPage.value = page
        await load(currentPage.value, setMeta)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return { loadPage }
}
