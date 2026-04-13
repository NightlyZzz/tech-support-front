<script setup lang="ts">
    import { LockKeyhole } from 'lucide-vue-next'
    import BaseInput from '@/components/base/BaseInput.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'

    defineProps<{
        newPassword: string
        showPassword: boolean
    }>()

    const emit = defineEmits<{
        (event: 'update:newPassword', value: string): void
        (event: 'update:showPassword', value: boolean): void
    }>()

    const updateShowPassword = (event: Event): void => {
        const checkboxElement = event.target as HTMLInputElement
        emit('update:showPassword', checkboxElement.checked)
    }
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <LockKeyhole class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Смена пароля
                    </CardTitle>
                    <CardDescription>
                        Оставьте поле пустым, если не хотите менять пароль
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <BaseInput
                    id="profile-new-password"
                    :model-value="newPassword"
                    label="Новый пароль"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Оставьте пустым"
                    @update:model-value="emit('update:newPassword', $event)"
            />

            <label class="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                        :checked="showPassword"
                        type="checkbox"
                        class="size-4 rounded border-input accent-primary"
                        @change="updateShowPassword"
                >
                Показать пароль
            </label>
        </CardContent>
    </Card>
</template>