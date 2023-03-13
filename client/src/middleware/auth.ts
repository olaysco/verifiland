import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { NavigationGuardNext, RouteLocation } from 'vue-router'
export const authGuard = (to: RouteLocation, from: RouteLocation) => {
  const fn = () => {
    const { user } = storeToRefs(useUserStore())
    if (!user.value) {
      return '/signin'
    }
  }

  return fn()
}
