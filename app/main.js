import { useEffect, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Project } from './components/project';
import { Header } from './components/header';
import { downloadGeojsonReducer, downloadInJOSMReducer } from './reducers';

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

  const [dlInJOSM, dispatchDLInJOSM] = useReducer(downloadInJOSMReducer, false);

  return (
    <BrowserRouter>
      <DevseedUiThemeProvider>
        <Header
          dispatchDSetDLGeojsonStatus={dispatchDSetDLGeojsonStatus}
          dispatchDLInJOSM={dispatchDLInJOSM}
        />
        <Routes>
          <Route exact path='/' element={<Project />} />
          <Route
            exact
            path='/project/:slug'
            element={
              <Project
                dlGeojsonStatus={dlGeojsonStatus}
                dispatchDSetDLGeojsonStatus={dispatchDSetDLGeojsonStatus}
                dlInJOSM={dlInJOSM}
                dispatchDLInJOSM={dispatchDLInJOSM}
              />
            }
          />
        </Routes>
      </DevseedUiThemeProvider>
    </BrowserRouter>
  );
}

const container = document.querySelector('#app-container');
const root = createRoot(container);
root.render(<App />);
