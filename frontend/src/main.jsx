import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initializeDatadog } from './datadog';

initializeDatadog();

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else if (import.meta.env.DEV) {
  console.error('Failed to find root element for React render.');
}
