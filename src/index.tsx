import { createRoot } from 'react-dom';
import { App } from './App';

// register service worker
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'deployment') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => console.log(error));
  });
}

// set root of the app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

// render the app
root.render(<App />);
