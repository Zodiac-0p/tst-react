// src/main.jsx or src/index.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ReactDOM from "react-dom/client";
import AuthProvider from "./AuthProvider";

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
