import { defineStore } from 'pinia'

export interface Alert {
  type: 'success' | 'warning' | 'danger' | 'empty'
  message: string
}

export const useUIStore = defineStore({
  id: 'ui',
  state: (): { busy: boolean; alerts: Alert[] } => ({
    busy: false,
    alerts: []
  }),
  getters: {},
  actions: {
    hideLoader() {
      this.busy = false
    },
    showLoader() {
      this.busy = true
    },
    showAlert(alertOptions: Alert) {
      this.alerts.push(alertOptions)
    }
  }
})
