import { useEffect } from 'react';
import { render } from 'react-dom';

function App() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return <p>Hello from Starter</p>;
}

render(<App />, document.querySelector('#app-container'));
