import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import MainContextProvider from './contexts/MainContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <MainContextProvider>
      <BrowserRouter basename="/ds-annotate">
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/project/:slug" element={<App />} />
        </Routes>
      </BrowserRouter>
    </MainContextProvider>
);
