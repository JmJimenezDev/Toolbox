import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import { router } from './core/router/router'
import { RouterProvider } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './utils/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>,
)
