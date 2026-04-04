<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        modelValue: number
        lastPage: number
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', page: number): void
    }>()

    const changePage = (page: number) => {
        if (page < 1 || page > props.lastPage || page === props.modelValue) {
            return
        }
        emit('update:modelValue', page)
    }

    const pages = computed<(number | string)[]>(() => {
        const total = props.lastPage
        const current = props.modelValue

        const result: (number | string)[] = []

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                result.push(i)
            }
            return result
        }

        result.push(1)

        if (current > 3) {
            result.push('...')
        }

        for (let i = current - 1; i <= current + 1; i++) {
            if (i > 1 && i < total) {
                result.push(i)
            }
        }

        if (current < total - 2) {
            result.push('...')
        }

        result.push(total)

        return result
    })
</script>

<template>
    <div class="pagination">
        <button
                class="btn"
                @click="changePage(modelValue - 1)"
                :disabled="modelValue === 1"
        >
            ←
        </button>

        <template v-for="page in pages" :key="page + '-' + modelValue">
            <button
                    v-if="typeof page === 'number'"
                    class="btn"
                    :class="{ active: page === modelValue }"
                    @click="changePage(page)"
            >
                {{ page }}
            </button>

            <span v-else class="dots">...</span>
        </template>

        <button
                class="btn"
                @click="changePage(modelValue + 1)"
                :disabled="modelValue === lastPage"
        >
            →
        </button>
    </div>
</template>

<style scoped>
    .pagination {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 20px;
    }

    .btn {
        padding: 6px 10px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
    }

    .btn.active {
        background: #3b82f6;
        color: white;
    }

    .dots {
        padding: 6px 10px;
    }
</style>