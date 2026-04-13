<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle
    } from '@/components/ui/dialog'

    const props = defineProps<{
        open: boolean
        loading: boolean
    }>()

    const emit = defineEmits<{
        (event: 'close'): void
        (event: 'logoutCurrent'): void
        (event: 'logoutAll'): void
    }>()

    const updateOpen = (value: boolean): void => {
        if (!value) {
            emit('close')
        }
    }
</script>

<template>
    <Dialog :open="props.open" @update:open="updateOpen">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>
                    Выход из аккаунта
                </DialogTitle>
                <DialogDescription>
                    Выберите, нужно выйти только на этом устройстве или завершить все активные сессии
                </DialogDescription>
            </DialogHeader>

            <div class="flex flex-col gap-3">
                <BaseButton
                        type="button"
                        variant="primary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('logoutCurrent')"
                >
                    Выйти только на этом устройстве
                </BaseButton>

                <BaseButton
                        type="button"
                        variant="primary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('logoutAll')"
                >
                    Выйти на всех устройствах
                </BaseButton>

                <BaseButton
                        type="button"
                        variant="secondary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('close')"
                >
                    Отмена
                </BaseButton>
            </div>
        </DialogContent>
    </Dialog>
</template>