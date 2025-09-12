import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routes/index.tsx'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from './providers/theme.providers.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store.ts'
import 'leaflet/dist/leaflet.css';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
    <Toaster richColors />
    </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)
