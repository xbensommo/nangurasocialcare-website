/**
* @title Enterprise Router Package
* @description A reusable Vue Router wrapper with enterprise guards, caching, and analytics.
* @file enterprise-router.js
*/
import { createRouter, createWebHistory } from 'vue-router'

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================
const defaults = {
  appName: 'App',
  sensitiveRoles: [],
  googleAnalyticsId: null,
// Default Error Routes Generator
  errorRoutes: (loader) => [
    { path: '/401', name: '401', component: loader('401'), props: route => ({ code: '401', message: route.query.message, description: route.query.reason }) },
    { path: '/403', name: '403', component: loader('403'), props: route => ({ code: '403', message: route.query.message, description: route.query.reason }) },
    { path: '/500', name: '500', component: loader('500'), props: route => ({ code: '500', message: route.query.message, description: route.query.reason }) },
    { path: '/:pathMatch(.*)*', name: '404', component: loader('404'), props: { code: '404', message: 'Page Not Found' } }
  ]
}

/**
* Creates an Enterprise Router instance
* @param {Object} options
* @param {Array} options.routes - Your application routes
* @param {Function} options.useStore - The Pinia store hook (e.g., useAppStore)
* @param {Object} options.settings - App settings (appName, gaId, etc)
* @param {Object} options.adapters - Functions to map your store state to the router
* @param {Function} options.viewLoader - A function to load views (for default error pages)
*/
export function createEnterpriseRouter({ 
  routes = [], 
  useStore, 
  settings = {}, 
  adapters = {},
  viewLoader = null
}) {
  const config = { ...defaults, ...settings }

// Merge user routes with default error routes if a loader is provided
  const allRoutes = [...routes]
  if (viewLoader && config.errorRoutes) {
    allRoutes.push(...config.errorRoutes(viewLoader))
  }

// ==========================================================================
// ROUTER INSTANCE
// ==========================================================================
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: allRoutes,

    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
        if (to.hash) return { el: to.hash, behavior: 'smooth', top: 0 }
          return { top: 0, left: 0 }
      },

      stringifyQuery: (query) => {
        const parts = []
        for (const key in query) {
          if (query[key] != null) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
          }
        }
        return parts.length ? '?' + parts.join('&') : ''
      },

      parseQuery: (query) => {
        if (!query || query === '?') return {}
          const parsed = {}
        const search = query.substring(1)
        const pairs = search.split('&')
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i]
          const eqIndex = pair.indexOf('=')
          if (eqIndex === -1) parsed[decodeURIComponent(pair)] = ''
            else parsed[decodeURIComponent(pair.substring(0, eqIndex))] = decodeURIComponent(pair.substring(eqIndex + 1))
        }
        return parsed
      }
  })

// ==========================================================================
// GUARDS
// ==========================================================================
  let navigationStartTime = 0

  router.beforeEach(async (to, from, next) => {
    navigationStartTime = Date.now()
    const store = useStore() // Initialize store inside guard to ensure Pinia is ready
    console.error('before each stating')
    // 1. DUPLICATE CHECK
    const isInitialLoad = from.matched.length === 0
    const isSameRoute = !isInitialLoad && to.path === from.path && JSON.stringify(to.query) === JSON.stringify(from.query) && from.hash === to.hash

    // Map Store State using Adapters
    const authInitialized = adapters.getAuthInitialized ? adapters.getAuthInitialized(store) : store.authInitialized;
    

    const currentUser = adapters.getCurrentUser ? adapters.getCurrentUser(store) : store.currentUser;
    
    const userRole = currentUser?.[adapters.roleKey || 'role'];
    console.log('userRole', userRole, currentUser, authInitialized)
    if (isSameRoute) {
      adapters.loading(store, false)
      return next(false)
    }

    // 2. LOADING
    const isProtected = to.matched.some(r => r.meta.requiresAuth || r.meta.roles)
    console.log(isProtected, 'is Protected')
    if (isProtected) adapters.loading(store, true)

    // 3. ENTERPRISE LOGIC
      try {
        // Fast Path

       // if (!authInitialized) return next() // Allow app to hydrate
          console.log('authInitialized')

        // Guest Only (e.g., Login page)
          if (to.meta.guestOnly && currentUser) {
            const dest = adapters.getDefaultDestination ? adapters.getDefaultDestination(store) : '/'
            return next(dest)
          }

        // Auth Required
          const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
          console.log('126', requiresAuth, currentUser)

          if (requiresAuth && !currentUser) {
            return next({ name: 'Login', query: { redirect: to.fullPath, reason: 'auth_required' }})
          }

          // Role Check
            const routeRoles = to.matched.find(r => r.meta.roles)?.meta?.roles
            console.log('starting role check', routeRoles)
            if (routeRoles && currentUser) {
          // Use custom permission checker or default includes check
              const hasPermission = adapters.checkPermission 
              ? adapters.checkPermission(store, routeRoles, to.name)
              : routeRoles.includes(userRole)

              if (!hasPermission) {
                return next({ 
                  name: '403', 
                  query: { message: 'Access Denied', reason: `Role ${userRole} missing required permissions` } 
                })
              }

    // Sensitive Role / Claims Check
        const isSensitive = config.sensitiveRoles.includes(userRole)
        if (isSensitive) {
          const hasClaim = adapters.checkClaim ? adapters.checkClaim(store, userRole) : true
          if (!hasClaim) {
            console.warn(`[Guard] Missing claim for sensitive role: ${userRole}`)
    // Trigger background refresh if adapter provided
            if (adapters.refreshClaims) setTimeout(() => adapters.refreshClaims(store), 500)
          }
      }
      }

      next()
      } catch (error) {
        console.error('[Router] Guard Error', error)
        adapters.loading(store, false)
        next({ name: '500', query: { error: 'guard_failed' } })
      }
})

// ==========================================================================
// AFTER EACH
// ==========================================================================
  router.afterEach((to) => {
    const store = useStore()
    adapters.loading(store, false)

    // Timing
    const time = Date.now() - navigationStartTime
    if (time > 100 && import.meta.env.DEV) console.debug(`[Perf] ${to.path}: ${time}ms`)

    // Title
      let title = to.meta?.title || to.name?.toString().replace(/([A-Z])/g, ' $1').trim()
    document.title = title ? `${title} | ${config.appName}` : config.appName

    // Analytics
    if (window.gtag && import.meta.env.PROD && config.googleAnalyticsId) {
      window.gtag('config', config.googleAnalyticsId, {
        page_path: to.path,
        page_title: document.title
      })
    }
  })

// ==========================================================================
// GLOBAL ERROR RECOVERY
// ==========================================================================
  router.onError((error) => {
    const store = useStore()
    adapters.loading(store, false)
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      if (!sessionStorage.getItem('router:chunk_error')) {
        sessionStorage.setItem('router:chunk_error', 'true')
        window.location.reload()
      }
    }
  })

  return router
}

/**
* Helper to create a standardized lazy loader
* @param {Function} pathResolver - A function that takes (view, dir) and returns the import string
*/
export const createLazyHelper = (pathResolver) => {
  return (view, dir) => () => pathResolver(view, dir)
}