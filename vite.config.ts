import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['calculator.svg'],
      manifest: {
        name: 'Miniräknaren – enkel och avancerad',
        short_name: 'Miniräknaren',
        description: 'En lokal miniräknare för vardagsräkning och vetenskapliga beräkningar.',
        lang: 'sv',
        start_url: '.',
        display: 'standalone',
        background_color: '#f4f7fb',
        theme_color: '#14213d',
        icons: [
          { src: 'calculator.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'calculator-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}']
      }
    })
  ]
})
