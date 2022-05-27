import { useEffect, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Project } from './components/project';
import { Header } from './components/header';
import { downloadGeojsonReducer } from './reducers';

function App() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    if (banner) banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  const [dlGeojsonStatus, dispatchDSetDLGeojsonStatus] = useReducer(
    downloadGeojsonReducer,
    false
  );

  return (
    <BrowserRouter>
      <DevseedUiThemeProvider>
        <Header dispatchDSetDLGeojsonStatus={dispatchDSetDLGeojsonStatus} />
        <Routes>
          <Route exact path='/' element={<Project />} />
          <Route
            exact
            path='/project/:slug'
            element={<Project dlGeojsonStatus={dlGeojsonStatus} />}
          />
        </Routes>
      </DevseedUiThemeProvider>
    </BrowserRouter>
  );
}

const container = document.querySelector('#app-container');
const root = createRoot(container);
root.render(<App />);
