import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// No StrictMode on purpose: it mounts effects twice in development, and the
// animation engine (text splitting, WebGL, scroll triggers) must start exactly once.
createRoot(document.getElementById('root')).render(<App />);
