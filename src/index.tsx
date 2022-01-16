import ReactDOM from 'react-dom';
import { DefaultLoadingManager } from 'three';
import { App } from './App';

// register service worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => console.log(error));
  });
}

// get url on load start
let currentUrl = '';
DefaultLoadingManager.onStart = (url: string) => {
  currentUrl = url;
};
// send load event on load to progress loading animation
DefaultLoadingManager.onLoad = () => {
  dispatchEvent(new CustomEvent('assetLoad', { detail: currentUrl }));
};

// render the app
ReactDOM.render(<App />, document.getElementById('root'));
