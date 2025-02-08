import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
    id: number
    name: string
    email: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        roles: [] as string[],
        permissions: [] as string[],
    }),
    actions: {
        async fetchUser() {
            const { data } = await axios.get<User>('/api/user')
            this.user = data
            await this.fetchPermissions()
        },
        async fetchPermissions() {
            const { data } = await axios.get<{ roles: string[], permissions: string[] }>('/api/user/permissions')
            this.roles = data.roles
            this.permissions = data.permissions
        },
        hasPermission(permission: string): boolean {
            return this.permissions.includes(permission)
        },
        hasRole(role: string): boolean {
            return this.roles.includes(role)
        }
    }
})
