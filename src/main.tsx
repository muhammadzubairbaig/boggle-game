import { createRoot } from 'react-dom/client'
import '@/index.css'
import * as React from 'react';
import { App } from '@/app/index';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
