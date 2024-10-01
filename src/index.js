import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

if (typeof window !== 'undefined') {
    const observerErr = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      if (message === 'ResizeObserver loop completed with undelivered notifications.') {
        return true; // Ignore this specific error
      }
      return observerErr?.(message, source, lineno, colno, error);
    };
  }
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
