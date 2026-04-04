import { ref } from 'vue'
import type { User } from "@/modules/user/model/user.ts";

export const user = ref<User | null>(null)

export const getUser = () => user

export const isAuthenticated = (): boolean => {
    return !!user.value
}