import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shen Haoming Portfolio',
    short_name: 'Shen Haoming',
    description: 'Portfolio and guestbook of Shen Haoming, a software developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon_light.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon_light.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
