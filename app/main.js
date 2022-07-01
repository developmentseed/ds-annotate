import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainContextProvider from './contexts/Maincontext';
import { Project } from './components/project';
import { Header } from './components/header';

function App() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    if (banner) banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <MainContextProvider>
      <BrowserRouter>
        <DevseedUiThemeProvider>
          <Header />
          <Routes>
            <Route exact path='/' element={<Project />} />
            <Route exact path='/project/:slug' element={<Project />} />
          </Routes>
        </DevseedUiThemeProvider>
      </BrowserRouter>
    </MainContextProvider>
  );
}

const container = document.querySelector('#app-container');
const root = createRoot(container);
root.render(<App />);
