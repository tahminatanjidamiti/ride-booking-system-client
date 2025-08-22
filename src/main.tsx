import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routes/index.tsx'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from './providers/theme.providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
