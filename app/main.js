import { useEffect } from 'react';
import { render } from 'react-dom';

import { MapWrapper } from './components/map';
import projects from '../static/projects.json';

function App() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    if (banner) banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <>
      <MapWrapper project={projects.features[0]} />
    </>
  );
}

render(<App />, document.querySelector('#app-container'));
