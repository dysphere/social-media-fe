import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <AuthProvider>
    <Router/>
    </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
