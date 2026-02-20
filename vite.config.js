import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    
    // Use dynamic import for the prerender plugin
    /*(await import('vite-plugin-prerender')).default({
      staticDir: path.join(process.cwd(), 'dist'),
      routes: [
        '/',
        '/about',
        '/contact',
        '/faq',
        '/pricing',
        '/services',
        '/services/individual-counselling',
        '/services/couples-counselling',
        '/services/child-counselling',
        '/services/trauma-counselling',
        '/services/workplace-counselling',
        '/services/online-therapy',
        '/services/in-person-therapy-tsumeb',
        '/crisis-support-namibia',
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy',
        '/disclaimer'
      ]
    })*/
  ],

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  }
})