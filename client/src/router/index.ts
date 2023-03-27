import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { authGuard } from '@/middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('../views/VerifyView.vue')
    },
    {
      path: '/assets',
      name: 'assets',
      beforeEnter: authGuard,
      component: () => import('../views/AssetsView.vue')
    },
    {
      path: '/add-assets',
      name: 'addAssets',
      beforeEnter: authGuard,
      component: () => import('../views/AddAssetsView.vue')
    },
    {
      path: '/transfer-assets',
      name: 'transferAssets',
      beforeEnter: authGuard,
      component: () => import('../views/AssetTransfer.vue')
    },
    {
      path: '/transfer-list',
      name: 'transferLists',
      beforeEnter: authGuard,
      component: () => import('../views/AssetTransferStatus.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      beforeEnter: authGuard,
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router
