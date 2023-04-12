import { API_URL } from './../services/config'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'

interface User {
  fullname: string
  email: string
  password?: string
  passwordConfirm?: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null as User | null,
    accessToken: null as string,
    loading: false,
    error: null
  }),
  getters: {},
  actions: {
    async login(username: string, password: string) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password })
        this.accessToken = response.data?.access_token
        await this.getProfile()
      } catch (error) {
        this.error = error.response.data
        throw error.response.data
      } finally {
        this.loading = false
      }
    },
    async register(data: User) {
      this.loading = true
      try {
        const response = await axios.post(`${API_URL}/auth/register`, data)
        this.user = response.data
        await this.login(this.user.email, data.password)
      } catch (error) {
        this.error = error.response.data
        throw error.response.data
      } finally {
        this.loading = false
      }
    },
    async getProfile() {
      this.user = null
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        this.user = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.user = null
      this.accessToken = null

      router.push('/')
    },
    isAdmin() {
      if (this.user && Array.isArray(this.user.role)) {
        return this.user.role.includes('ADMIN')
      }

      return false
    }
  },
  persist: true
})
