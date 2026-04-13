<script setup lang="ts">
    import { ref } from 'vue'
    import { Headset, Phone, Send, Text } from 'lucide-vue-next'
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import BaseTextarea from '@/components/base/BaseTextarea.vue'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Badge } from '@/components/ui/badge'
    import { useCreateTicket } from '@/modules/ticket/composables/useCreateTicket'
    import { usePhoneInput } from '@/composables/common/usePhoneInput'

    const { form, ticketTypes, isSubmitting, submitTicket } = useCreateTicket()
    const { displayPhone, handlePhoneInput, allowOnlyDigits } = usePhoneInput(form)

    const phoneInputKey = ref(0)

    const handleSubmit = async (): Promise<void> => {
        await submitTicket()
        phoneInputKey.value += 1
    }
</script>

<template>
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Headset class="size-7"/>
                    </div>

                    <div class="space-y-3">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-semibold tracking-tight">
                                Создать заявку
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Опишите проблему, выберите тип обращения и оставьте контактный телефон
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge variant="secondary" class="rounded-full px-3 py-1">
                                {{ ticketTypes.length }} типов заявок
                            </Badge>

                            <Badge variant="secondary" class="rounded-full px-3 py-1">
                                Ответ в рамках рабочего процесса
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Card class="mx-auto w-full max-w-2xl rounded-3xl">
            <CardHeader class="space-y-3">
                <CardTitle class="text-xl">
                    Информация о заявке
                </CardTitle>
                <CardDescription>
                    Чем точнее описание, тем быстрее обращение попадет в работу
                </CardDescription>
            </CardHeader>

            <CardContent class="space-y-5">
                <BaseSelect
                        id="ticket_type"
                        v-model="form.ticketTypeId"
                        label="Тип запроса"
                        placeholder="Выберите тип запроса"
                        :items="ticketTypes"
                        label-key="name"
                        value-key="id"
                />

                <div class="flex flex-col gap-2">
                    <label for="contact_phone" class="text-sm font-medium text-foreground">
                        Контактный телефон
                    </label>

                    <div class="relative">
                        <Phone class="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"/>

                        <input
                                :key="phoneInputKey"
                                id="contact_phone"
                                :value="displayPhone"
                                type="tel"
                                inputmode="numeric"
                                maxlength="18"
                                placeholder="+7 (___) ___-__-__"
                                class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-11 w-full rounded-md border bg-transparent pr-3 pl-10 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                @input="handlePhoneInput"
                                @keydown="allowOnlyDigits"
                        >
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <label for="description" class="text-sm font-medium text-foreground">
                            Краткое описание проблемы
                        </label>

                        <span class="text-xs text-muted-foreground">
                            {{ form.description.length }}/255
                        </span>
                    </div>

                    <div class="relative">
                        <Text class="pointer-events-none absolute top-3 left-3 z-10 size-4 text-muted-foreground"/>

                        <BaseTextarea
                                id="description"
                                v-model="form.description"
                                placeholder="Опишите вашу проблему"
                                :rows="5"
                                :maxlength="255"
                                textarea-class="pl-10"
                        />
                    </div>
                </div>

                <BaseButton
                        variant="primary"
                        :full-width="true"
                        :loading="isSubmitting"
                        :disabled="isSubmitting"
                        @click="handleSubmit"
                >
                    <Send class="size-4"/>
                    Отправить заявку
                </BaseButton>
            </CardContent>
        </Card>
    </div>
</template>