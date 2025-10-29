/**
 * Main Entry Point
 * Ubuntu×XP Desktop Portfolio
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DeviceProvider } from './os/contexts/DeviceContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DeviceProvider>
        <App />
      </DeviceProvider>
    </BrowserRouter>
  </React.StrictMode>
);
